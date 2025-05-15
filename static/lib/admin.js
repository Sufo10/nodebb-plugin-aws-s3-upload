'use strict';

define('admin/plugins/aws-s3-upload', ['settings', 'alerts'], function (
  Settings,
  alerts
) {
  var ACP = {};

  ACP.init = function () {
    Settings.load('aws-s3-upload', $('.aws-s3-upload-settings'));

    $('#save').on('click', function () {
      Settings.save('aws-s3-upload', $('.aws-s3-upload-settings'), function () {
        alerts.alert({
          type: 'success',
          alert_id: 'aws-s3-upload-saved',
          title: 'Settings Saved',
          message:
            'Please rebuild and restart your NodeBB to apply these settings, or click on this alert to do so.',
          clickfn: function () {
            socket.emit('admin.reload');
          },
        });
      });
    });
  };

  return ACP;
});
