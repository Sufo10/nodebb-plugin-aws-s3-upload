# NodeBB Plugin: AWS S3 Upload ![npm](https://img.shields.io/npm/v/nodebb-plugin-aws-s3-upload?color=blue) ![MIT License](https://img.shields.io/badge/license-MIT-green.svg) ![NodeBB](https://img.shields.io/badge/NodeBB-Plugin-orange)

A NodeBB plugin that enables file and image uploads directly to Amazon S3, using AWS SDK v3. Configure via NodeBB Admin UI or `config.json`.

---

## ✨ Features

- 🚀 Upload images and files to Amazon S3
- ⚙️ Configure via NodeBB Admin UI or `config.json`
- 🔒 Secure integration using AWS SDK v3
- 🛡️ File type and size validation
- 🖥️ Easy-to-use admin page

## 📦 Installation

1. Install via npm (from your NodeBB root directory):
   ```bash
   npm install nodebb-plugin-aws-s3-upload
   ```
2. Activate the plugin in the NodeBB Admin Control Panel (ACP).
3. Rebuild and restart NodeBB.

## 🛠️ Configuration

You can configure the plugin in two ways:

### 1. Using `config.json`

Add an `s3` object to your NodeBB `config.json`:

```json
"s3": {
  "accessKeyId": "YOUR_AWS_ACCESS_KEY_ID",
  "secretAccessKey": "YOUR_AWS_SECRET_ACCESS_KEY",
  "region": "YOUR_AWS_REGION",
  "bucket": "YOUR_S3_BUCKET_NAME",
  "uploadPath": "YOUR_UPLOAD_PATH", // optional
  "host": "YOUR_ASSETS_SERVING_HOST" // optional
}
```

<p>
- <b>Asset host</b> and <b>uploadPath</b> are optional. By default, the URL is <code>http://mybucket/uuid.jpg</code>.<br/>
- Setting an asset host (e.g., <code>cdn.mywebsite.com</code>) changes the URL to <code>http://cdn.mywebsite.com/uuid.jpg</code>.<br/>
- Setting an asset uploadPath (e.g., <code>/assets</code>) makes it <code>http://mybucket/assets/uuid.jpg</code>.<br/>
- Using both gives <code>http://cdn.mywebsite.com/assets/uuid.jpg</code>.
</p>

### 2. Using the Admin UI

- Go to **Admin > Plugins > AWS S3 Configuration**
- Fill in your AWS credentials, region, bucket, and upload path
- Click **Save**
- Rebuild and restart NodeBB for changes to take effect

> **Note:** Settings saved in the database (via Admin UI) take precedence over `config.json`.

## 📤 Usage

- After configuration, users can upload files and images as usual in NodeBB posts.
- Files are stored in your specified S3 bucket and path.

## 🧩 Troubleshooting & Support

- For help, open an [issue on GitHub](https://github.com/Sufo10/nodebb-plugin-aws-s3-upload/issues).
- Check NodeBB logs for error messages if uploads fail.

## 🏗️ Development

- Main plugin logic: `library.js`
- Admin UI logic: `static/lib/admin.js`
- Admin template: `static/templates/admin/plugins/aws-s3-upload.tpl`

## 📄 License

MIT

---

**Author:** Sujan Chhetri Poudel ([sujan.poudel210@gmail.com](mailto:sujan.poudel210@gmail.com))
