/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"de/robertwitt/tutorial/api/slackapp/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});