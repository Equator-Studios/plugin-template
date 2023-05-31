# Plugin Repository

This repository is a collection of plugins for Equator. These plugins extend the functionality of the Equator, and we invite members of the public to contribute plugins that they think will be useful.

## Plugin Structure

Each plugin should be structured as a separate directory under the `plugins` directory. The directory should be named according to the plugin's name. Please do not use spaces or special characters in the plugin name, and be sure to follow the CamelCase naming convention.

Inside the plugin directory, there should be four files:

1. `manifest.json`: This file describes the plugin. It should contain the following properties:

    - `name`: The technical name of the plugin. This should match the name of the plugin's directory.
    - `display_name`: The display name of the plugin. This is the name that will be shown in the UI.
    - `description`: A brief description of what the plugin does.
    - `category`: The category of the plugin.
    - `image_url`: (Optional) The URL to the image for the plugin displayed in Equator.
    - `tags`: An array of tags that relate to the plugin. This should be an empty array if there are no relevant tags.
    - `version`: The version of the plugin.
    - `author`: The name of the plugin's author.

    Here's an example `manifest.json`:

    ```json
    {
        "name": "hello_world",
        "display_name": "Hello World",
        "description": "This is the description of the Hello World Plugin",
        "category": "category",
        "image_url": "",
        "tags": [],
        "version": "1.0.0",
        "author": "Hello World Author"
    }
    ```

2. `server.js`: This is the server-side script for the plugin. This file should contain the logic that runs on the server.

3. `client.js`: This is the client-side script for the plugin. This file should contain the logic that runs on the client.

4. `README.md`: This is the documentation/user guide for your plugin, this should inlcude all information needed to run and use your plugin.

Please make sure to follow this structure when creating your plugins.

## Contributing

To contribute a plugin to the repository:

1. Fork this repository.
2. Add your plugin to the `plugins` directory.
3. Make sure your plugin follows the above structure.
4. Submit a pull request.

When you submit a pull request, your plugin will be reviewed before it's merged into the repository. This is to ensure the quality of the plugins in the repository, and to make sure that they don't contain any malicious code.

Thank you for contributing to our plugin repository. We look forward to seeing what you create!
