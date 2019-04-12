sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("de.robertwitt.tutorial.api.slackapp.controller.View1", {
		onInit: function () {
			var oMessages = new JSONModel();
			this.getView().setModel(oMessages, "messages");
		}
	});

});