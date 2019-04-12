sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("de.robertwitt.tutorial.api.slackapp.controller.View1", {

		onInit: function () {
			var oMessages = new JSONModel();
			this.getView().setModel(oMessages, "messages");

			var that = this;
			var oSlackModel = new JSONModel();
			oSlackModel.loadData("model/slack_credentials.json");
			oSlackModel.attachRequestCompleted(function() {
				that._loadChannelMessages();
			});
			this.getView().setModel(oSlackModel, "slack");
		},

		_loadChannelMessages: function () {
			var oView = this.getView();
			oView.setBusy(true);

			var self = this;

			var oSlackModel = this.getView().getModel("slack");
			var channel = oSlackModel.getProperty("/channel");
			var token = oSlackModel.getProperty("/token");

			$.ajax({
					type: 'GET',
					url: "/slack/channels.history?channel=" + channel + "&token=" + token,
					async: false
				}).done(function (results) {
					console.log(results);
					self.getView().getModel("messages").setProperty("/data", results.messages);
					oView.setBusy(false);
				})
				.fail(function (err) {
					oView.setBusy(false);
					if (err !== undefined) {
						var oErrorResponse = $.parseJSON(err.responseText);
						sap.m.MessageToast.show(oErrorResponse.message, {
							duration: 6000
						});
					} else {
						sap.m.MessageToast.show("Unknown error!");
					}
				});
		}

	});

});