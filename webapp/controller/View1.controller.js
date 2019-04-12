sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	var paging = new JSONModel({
		"latest": "",
		"oldest": "",
		"pageLimit": 1
	});

	var initPage;

	return Controller.extend("de.robertwitt.tutorial.api.slackapp.controller.View1", {

		onInit: function () {
			var oMessages = new JSONModel();
			this.getView().setModel(oMessages, "messages");
			this.getView().setModel(paging, "pageData");
			initPage = true;

			var that = this;
			var oSlackModel = new JSONModel();
			oSlackModel.loadData("model/slack_credentials.json");
			oSlackModel.attachRequestCompleted(function () {
				that._loadChannelMessages("", "");
			});
			this.getView().setModel(oSlackModel, "slack");
		},

		onNextPress: function () {
			var latest = this.getView().getModel("pageData").getProperty("/latest");
			this._loadChannelMessages(latest, "");
		},

		onPrevPress: function () {
			var oldest = this.getView().getModel("pageData").getProperty("/oldest");
			this._loadChannelMessages("", oldest);
		},

		_loadChannelMessages: function (latest, oldest) {
			var oView = this.getView();
			oView.setBusy(true);

			var self = this;

			var oSlackModel = this.getView().getModel("slack");
			var channel = oSlackModel.getProperty("/channel");
			var token = oSlackModel.getProperty("/token");

			var pageLimit = this.getView().getModel("pageData").getProperty("/pageLimit");
			var latestTimestamp = latest;
			var oldestTimestamp = oldest;

			$.ajax({
					type: 'GET',
					url: "/slack/channels.history?channel=" + channel + "&token=" + token + "&count=" + pageLimit + "&latest=" + latestTimestamp +
						"&oldest=" + oldestTimestamp,
					async: false
				}).done(function (results) {
					console.log(results);
					self.getView().getModel("messages").setProperty("/data", results.messages);
					self.getView().getModel("pageData").setProperty("/latest", results.messages[results.messages.length - 1].ts);
					self.getView().getModel("pageData").setProperty("/oldest", results.messages[0].ts);

					if (initPage === true) {
						self.getView().getModel("pageData").setProperty("/oldestInit", results.messages[0].ts);
						self.getView().getModel("pageData").setProperty("/latestInit", results.messages[results.messages.length - 1].ts);
						initPage = false;
					}

					if (results.messages[results.messages.length - 1].ts >= self.getView().getModel("pageData").getProperty("/latestInit")) {
						self.getView().byId("nextButton").setProperty("enabled", true);
					} else {
						self.getView().byId("nextButton").setProperty("enabled", false);
					}

					if (results.messages[0].ts < self.getView().getModel("pageData").getProperty("/oldestInit")) {
						self.getView().byId("prevButton").setProperty("enabled", true);
					} else {
						self.getView().byId("prevButton").setProperty("enabled", false);
					}

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