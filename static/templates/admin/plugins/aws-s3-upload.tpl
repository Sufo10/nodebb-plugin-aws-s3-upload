<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 px-0 mb-4" tabindex="0">
			<div class="alert alert-info">
				<p>You can configure this plugin via 2 options:</p>
				<ul>
				<li><em>config.json</em>: You can add the following s3 property (an object) to config.json.
				<pre><code>
				"s3": {
    			"accessKeyId": "XXXXXXXXXXX",
    			"secretAccessKey": "XXXXXXXXXXXXX",
    			"region": "XXXXXXXXXXXXX",
    			"bucket": "XXXXXXXXXXXXXXXXX",
    			"uploadPath": "**/**"
  			}
				</code></pre>
				</li>
				<li><em>NodeBB Database:</em> Inputting values below will save them in the database used.</li>
				</ul>
				<p class="form-text">Note: Database saved configuration which is the configuration you input below takes precedence over config.json.</p>
			</div>
			<div class="alert alert-warning">
				If you need help, create an <a href="https://github.com/Sufo10/nodebb-plugin-aws-s3-upload/issues" target="_blank">issue on Github</a>.
			</div>
			<h4>Database Stored configuration:</h4>
			<form role="form" class="aws-s3-upload-settings">
				<div class="mb-3">
					<label for="accessKeyId">Access Key ID</label>
					<input id="accessKeyId" type="text" name="accessKeyId" title="Access Key ID" class="form-control input-lg" placeholder="Access Key ID">
				</div>
				<div class="mb-3">
					<label for="secretAccessKey">Access Secret Key</label>
					<input id="secretAccessKey" type="text" name="secretAccessKey" title="Access Secret Key" class="form-control" placeholder="Access Secret Key">
				</div>
				<div class="mb-3">
					<label for="region">Region</label>
					<input id="region" type="text" name="region" title="Region" class="form-control input-lg" placeholder="Region">
				</div>
				<div class="mb-3">
					<label for="bucket">Bucket</label>
					<input id="bucket" type="text" name="bucket" title="Bucket" class="form-control input-lg" placeholder="Bucket">
				</div>
				<div class="mb-3">
					<label for="uploadPath">Upload Path</label>
					<input id="uploadPath" type="text" name="uploadPath" title="Upload Path" class="form-control input-lg" placeholder="Upload Path">
				</div>
			</form>
		</div>
	</div>
</div>
