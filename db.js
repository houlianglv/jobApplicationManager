const Realm = require('realm');


const JobSchema = {
  name: 'JobApp',
  properties: {
    company: 'string',
    position: 'string',
    appDate: 'date',
    referal: 'string',
    url: 'string',
    update: 'string'
  }
};

const schema = {
  JobApp: JobSchema
};

var realm = new Realm({
  schema: [JobSchema],
  schemaVersion: 1,
  migration: function(oldRealm, newRealm) {
    // only apply this change if upgrading to schemaVersion 1
    if (oldRealm.schemaVersion < 1) {
      var oldObjects = oldRealm.objects('JobApp');
      var newObjects = newRealm.objects('JobApp');
      // loop through all objects and set the name property in the new schema
      for (var i = 0; i < oldObjects.length; i++) {
        newObjects[i].company = oldObjects[i].name;
      }
    }
  }
});

module.exports = {
  realm: realm,
  schema: schema
};