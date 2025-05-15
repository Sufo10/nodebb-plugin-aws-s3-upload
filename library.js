'use strict';

const S3 = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');

const winston = require.main.require('winston');
const nconf = require.main.require('nconf');
const meta = require.main.require('./src/meta');
const routeHelpers = require.main.require('./src/routes/helpers');
const fileModule = require.main.require('./src/file');

const readFile = promisify(fs.readFile);

const constants = Object.freeze({
  name: 'AWS S3 Configuration',
  admin: {
    route: '/plugins/aws-s3-upload',
    icon: 'fa-user-secret',
  },
  pluginId: 'nodebb-plugin-aws-s3-upload',
});

const plugin = {
  settings: nconf.get('s3') || {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    bucket: '',
    uploadPath: '',
  },
};

plugin.init = async (params) => {
  const { router } = params;
  routeHelpers.setupAdminPageRoute(
    router,
    '/admin/plugins/aws-s3-upload',
    (req, res) => {
      res.render('admin/plugins/aws-s3-upload', {
        title: constants.name,
      });
    }
  );
  await plugin.reloadSettings();
};

plugin.addAdminNavigation = (header) => {
  header.plugins.push({
    route: constants.admin.route,
    icon: constants.admin.icon,
    name: constants.name,
  });
  return header;
};

plugin.reloadSettings = async (data) => {
  if (data && data.plugin !== 'aws-s3-upload') {
    return;
  }

  const settings = await meta.settings.get('aws-s3-upload');

  if (settings.accessKeyId && settings.accessKeyId.length) {
    plugin.settings.accessKeyId = settings.accessKeyId;
  }
  if (settings.secretAccessKey && settings.secretAccessKey.length) {
    plugin.settings.secretAccessKey = settings.secretAccessKey;
  }
  if (settings.region && settings.region.length) {
    plugin.settings.region = settings.region;
  }
  if (settings.bucket && settings.bucket.length) {
    plugin.settings.bucket = settings.bucket;
  }
  if (settings.uploadPath && settings.uploadPath.length) {
    plugin.settings.uploadPath = settings.uploadPath;
  }
};

plugin.uploadImage = async (data) => {
  const { image } = data;

  if (!image) {
    winston.error('invalid image');
    return callback(new Error('invalid image'));
  }

  // check filesize vs. settings
  if (image.size > parseInt(meta.config.maximumFileSize, 10) * 1024) {
    winston.error(`error:file-too-big, ${meta.config.maximumFileSize}`);
    throw new Error(`[[error:file-too-big, ${meta.config.maximumFileSize}]]`);
  }

  const type = image.url ? 'url' : 'file';
  const allowed = fileModule.allowedExtensions();

  if (type === 'file') {
    if (!image.path) {
      throw new Error('Invalid image path');
    }

    if (!plugin.isExtensionAllowed(image.path, allowed)) {
      throw new Error(`[[error:invalid-file-type, ${allowed.join('&#44; ')}]]`);
    }

    const buffer = await readFile(image.path);
    return await plugin.uploadToS3(image.name, buffer);
  } else {
    if (!plugin.isExtensionAllowed(image.url, allowed)) {
      throw new Error(`[[error:invalid-file-type, ${allowed.join('&#44; ')}]]`);
    }
    const buffer = await plugin.downloadAndResizeImage(
      image.url,
      imageDimension
    );
    return await plugin.uploadToS3(filename, buffer);
  }
};

plugin.uploadFile = async (data) => {
  const { file } = data;

  if (!file) {
    throw new Error('invalid file');
  }

  if (!file.path) {
    throw new Error('invalid file path');
  }

  // check filesize vs. settings
  if (file.size > parseInt(meta.config.maximumFileSize, 10) * 1024) {
    winston.error(`error:file-too-big, ${meta.config.maximumFileSize}`);
    throw new Error(`[[error:file-too-big, ${meta.config.maximumFileSize}]]`);
  }

  const allowed = fileModule.allowedExtensions();
  if (!plugin.isExtensionAllowed(file.path, allowed)) {
    throw new Error(`[[error:invalid-file-type, ${allowed.join('&#44; ')}]]`);
  }

  const buffer = await readFile(file.path);
  return await plugin.uploadToS3(file.name, buffer);
};

plugin.uploadToS3 = async (filename, buffer) => {
  let s3Path;
  if (plugin.settings.uploadPath && plugin.settings.uploadPath.length > 0) {
    s3Path = plugin.settings.uploadPath;

    if (!s3Path.match(/\/$/)) {
      // Add trailing slash
      s3Path += '/';
    }
  } else {
    s3Path = '/';
  }

  const s3KeyPath = s3Path.replace(/^\//, ''); // S3 Key Path should not start with slash.

  const params = {
    Bucket: plugin.settings.bucket,
    Key: s3KeyPath + uuid() + path.extname(filename),
    Body: buffer,
    ContentLength: buffer.length,
    ContentType: (await import('mime')).default.getType(filename),
  };

  try {
    const s3Client = plugin.constructS3();
    await s3Client.send(new S3.PutObjectCommand(params));

    return {
      name: filename,
      url: `https://${params.Bucket}/${params.Key}`,
    };
  } catch (err) {
    throw new Error(plugin.createError(err));
  }
};

plugin.downloadAndResizeImage = async (url, dimension) => {
  const imageBuffer = await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to fetch image. Status: ${response.statusCode}`)
          );
        }
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });

  const type = (await import('file-type')).default.fileTypeFromBuffer(
    imageBuffer
  );
  const format = type?.ext || 'jpeg';

  const resizedBuffer = await sharp(imageBuffer)
    .resize(dimension, dimension, {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
    .toFormat(format)
    .toBuffer();

  return resizedBuffer;
};

plugin.constructS3 = () => {
  return new S3.S3Client({
    region: plugin.settings.region,
    credentials: {
      accessKeyId: plugin.settings.accessKeyId,
      secretAccessKey: plugin.settings.secretAccessKey,
    },
  });
};

plugin.createError = (err) => {
  if (err instanceof Error) {
    err.message = `${constants.pluginId} :: ${err.message}`;
  } else {
    err = new Error(`${constants.pluginId} :: ${err}`);
  }
  winston.error(err.message);
  return err;
};

plugin.isExtensionAllowed = (filePath, allowed) => {
  const extension = path.extname(filePath).toLowerCase();
  return !(
    allowed.length > 0 &&
    (!extension || extension === '.' || !allowed.includes(extension))
  );
};

module.exports = plugin;
