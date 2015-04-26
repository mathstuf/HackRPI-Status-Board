Meteor.startup(function() {

	// create the necessary indexes here
	// NOTE: The underscore before ensureIndex indicates that the function is
	//  undocumented by the Meteor Dev Group
	CommitMessages._ensureIndex( {"date" : -1} );
	CommitMessages._ensureIndex( {"sha" : 1} );
	Meteor.users._ensureIndex( {"username" : 1} );
	Meteor.users._ensureIndex( {"role" : 1} );
	RepositoryList._ensureIndex( {"name": 1} );
	MentorQueue._ensureIndex( {"completed": 1} );

	// Server Variables ========================================================
	var admin_doc = Meteor.users.findOne({ "username":Meteor.settings.default_admin_username });
	var admin_id = "";
	if (admin_doc)
		admin_id = admin_doc._id;
	// =========================================================================

	// create the admin account with a default password
	if (Meteor.users.find( {username: Meteor.settings.default_admin_username} ).fetch().length == 0) {
		console.log(">> admin account created");
		admin_id = Accounts.createUser({
			"username": Meteor.settings.default_admin_username,
			"password": Meteor.settings.default_admin_password,
			"profile": {
				"name": "Administrator",
				"settings": {
					"allow_account_creation": false,
					"mentoring_system": false
				}
			}
		});
		// give the admin admin rights
		var adminUser = Meteor.users.findOne({ "_id":admin_id });
		Roles.addUsersToRoles(adminUser, ["super","admin","flagger","announcer","manager"]);
	}


	// Repeating Server Actions ==================================================

	// refresh the commit database every 30 seconds
	Meteor.setInterval(function() {
		Meteor.call("refreshCommitsAllRepos");
	}, 60*1000);

	// show check for new announcements to show every 30 seconds
	Meteor.setInterval(function() {
		Meteor.call("showAnnouncements");
	}, 10*1000);

	// assign free mentors to hackers in the queue every 60 seconds
	Meteor.setInterval(function() {
		Meteor.call("assignMentors");
	}, 10*1000);

	// check for responses from mentors to clear their statuses
	// Meteor.setInterval(function() {
	//   Meteor.call("checkMentorResponses");
	// }, 60*1000);

	// update the mentor status (active/suspended every minute)
	// Meteor.setInterval(function() {
	// 	Meteor.call("updateMentorStatus");
	// }, 10*1000);

	// ===========================================================================
});