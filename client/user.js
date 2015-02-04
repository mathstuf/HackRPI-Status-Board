if (Meteor.isClient) {

  Template.user.rendered = function() {
    Session.set("active-page", "nav-user");
    Session.set("user-page", "user_profile");
    $(".user-sidebar-btn").removeClass("active");
    $("#user-profile-btn").addClass("active");
  };

  var s_username = "";
  var s_userID = "";
  var s_realname = "";
  var s_projectname = "";
  var s_location = "";
  var s_user_dep = new Tracker.Dependency;

  Tracker.autorun(function(){
    // called automatically whenever the session variable changes
    var selectedUserName = Session.get("selectedUserName");
    Meteor.subscribe("userData");
    var s_user = Meteor.users.find( {username : selectedUserName} ).fetch()[0];
    if (s_user) {
      s_username = selectedUserName;
      s_userID = s_user._id;
      if (s_user.profile) {
        s_realname = s_user.profile.real_name;
        s_projectname = s_user.profile.project_name;
        s_location = s_user.profile.location;
      }
      s_user_dep.changed();
    }
  });


  Template.user.helpers({
    user_page: function() {
      var page = Session.get("user-page");
      $(".user-sidebar-btn").removeClass("active");
      $("#"+page).addClass("active");
      if (page == "user-settings-btn")
        return "user_settings";
      else if (page == "user-hacker-btn")
        return "user_hacker";
      else if (page == "user-mentor-btn")
        return "user_mentor";
      else if (page == "user-volunteer-btn")
        return "user_volunteer";
      else if (page == "user-announcements-btn")
        return "user_announcements";
      else if (page == "user-database-btn")
        return "user_database";
      else {
        $("#user-profile-btn").addClass("active");
        return "user_profile";
      }
    },
  });


  Template.user.events({
    'click .user-sidebar-btn': function(e) {
      Session.set("user-page", e.currentTarget.id);
    }
  });

// =============================================================================

  Template.user_profile.helpers({
    userName: function() {
      s_user_dep.depend();
      return s_username;
    },
    realName: function() {
      s_user_dep.depend();
      return s_realname;
    },
    projectName: function() {
      s_user_dep.depend();
      return s_projectname;
    },
    location: function() {
      s_user_dep.depend();
      return s_location;
    },

    editable: function() {
      s_user_dep.depend();
      if (Meteor.user())
        return s_userID == Meteor.user()._id;
    },
    editActive: function() {
      return user_profile_edit;
    },
  });

  var user_profile_edit = false;

  Template.user_profile.events({
    'click #user-profile-edit-btn': function() {
      user_profile_edit = true;
    },
    'click #user-profile-save-btn': function() {
      // check edits and save to db
      user_profile_edit = false;
    },
  });

}
