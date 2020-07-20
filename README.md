# Liferay Instagram Basic Display

A Liferay React widget that shows the last media uploaded to an Instagram account using the [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api "Instagram Basic Display API"). Made with the [Liferay js toolkit](https://github.com/liferay/liferay-js-toolkit "Liferay js toolkit").

## Requeriments
- A Liferay 7.2 or 7.3 instance.
- Access to the Instagram Basic Display API. You will need a token and an Instragram user ID. Follow [the documentation](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started "the documentation").
- [Slick carousel](https://github.com/kenwheeler/slick "Slick carousel") loaded in your theme/page.
- [JQuery](https://code.jquery.com/ "JQuery") included in your theme/page (only for 7.3+, that it is not included by default anymore)

## Installation
1. Download the .jar located in ./dist, or clone this repo and run `npm run build`.
1. Copy the .jar file into the ${liferayHome}/**deploy** folder of your Liferay instance.
1. Add the portlet into your page. It will be in the **Sample** category unless you change it.
1. Configure the portlet
	1. Add you token and user id mentioned before.
> you may want to generate a [long-lived token](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens "long-lived token") that you can use for 60 days and refresh it anytime
	1. Save it.
1. Refresh the page.
1. You are done!


------------

#### System settings
You can add the id and token in the system settings and those will be used by default if you do not specify any in the portlet configuration

#### Portlet settings
- **User ID** - ID of your app Instagram user
- **Access Token** - Token for your Instagram Basic Display app
- **Images Width**
- **Images Height**
- **Slides to show** - Maximum number of slides to show per row
- **Captions** - Show/Hide feed captions
- **Rows**
- **Font Size** - Size of the captions