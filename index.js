#!/usr/bin/env node
var program = require('commander');
var fs = require('fs')
var Promise = require('promise')
var Mustache = require('mustache')
var path = require('path');
var _str = require('lodash/string');

var BASE_PATH = __dirname

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

program
  .arguments('<modulename>')
  .option('-d, --dirdest <dirdest>', 'The directory destination')
  .option('-s, --schema <schema>', 'Schema json file for your module')
  .option('-f, --fields <fields>', 'array of fields')
  .option('-e, --endpoint <endpoint>', 'api endpoint')

  .action(function (moduleName) {

    var promise = new Promise(function (resolve, reject) {


      if (fs.existsSync(program.dirdest)) {
        resolve(program.dirdest)
      }
      reject('Destination does not exist')
    })
      .then(function (destination) {


        var mod = destination + '/' + _str.kebabCase(moduleName);

        fs.mkdirSync(mod)

        if (fs.existsSync(mod)) {
          return mod;
        }

      })
      .then(function (module) {

        var lowerCaseModule = module.toLowerCase()

        var p1 = new Promise(function (resolve, reject) {
          if (fs.existsSync(module)) {
            fs.mkdir(module + '/actions')
            resolve(module + '/actions')
          }
        });

        var p2 = new Promise(function (resolve, reject) {
          if (fs.existsSync(module)) {
            fs.mkdir(module + '/components')
            resolve(module + '/components')
            fs.mkdir(module + '/components/' + _str.startCase(module) + 's')
          }
        });

        var p3 = new Promise(function (resolve, reject) {
          if (fs.existsSync(module)) {
            fs.mkdir(module + '/containers')
            resolve(module + '/containers')
          }
        });

        var p4 = new Promise(function (resolve, reject) {
          if (fs.existsSync(module)) {
            fs.mkdir(module + '/stores')
            resolve(module + '/stores')
          }
        });

        var p5 = new Promise(function (resolve, reject) {
          if (fs.existsSync(module)) {
            fs.mkdir(module + '/resources')
            resolve(module + '/resources')
          }
        });


        return Promise.all([p1, p2, p3, p4, p5]).then(function (values) {
          return values
        });

      })
      .then(function (folders) {

        var mod = _str.kebabCase(moduleName)

        var schema = {}
        var listData = []

        if (program.fields) {
          listData = program.fields.split(",").map(item => {
            return {
              dataOrig: item.trim(),
              dataStarCase: _str.startCase(item.trim()),
              dataType: item.trim()
            }
          })
        }

        if (fs.existsSync(program.schema)) {
          schema = JSON.parse(fs.readFileSync(program.schema).toString())
          listData = schema.data.map(item => {
            return {
              dataOrig: item.field,
              dataStarCase: _str.startCase(item.field),
              dataType: item.type
            }
          })
        }

        var containerData = {
          moduleNameCamelCase: _str.camelCase(moduleName),
          moduleNameLowerCase: moduleName.toLowerCase(),
          moduleNameOrig: moduleName,
          moduleNameUpperCase: moduleName.toUpperCase(),
          moduleNameKebabCase: mod,
          moduleStartCase: _str.startCase(moduleName),
          listData: listData,
          formData: listData,
          apiEndPoint: program.endpoint || this.moduleNameLowerCase
        }

        if (folders.indexOf(program.dirdest + '/' + mod + '/actions') > -1) {

          var p3 = new Promise(function (resolve, reject) {

            var containerTemplate = fs.readFileSync(BASE_PATH + '/templates/kactions.template').toString()

            var output = Mustache.render(containerTemplate, containerData)

            fs.writeFileSync(program.dirdest + '/' + mod + '/actions/' + _str.startCase(mod) + 'Actions.js', output)

            if (fs.existsSync(program.dirdest + '/' + mod + '/actions/' + _str.startCase(mod) + 'Actions.js')) {
              resolve(program.dirdest + '/' + mod + '/actions/' + _str.startCase(mod) + 'Actions.js')
            }
            else {
              reject('actions didnt created')
            }

          });

        }

        if (folders.indexOf(program.dirdest + '/' + mod + '/components') > -1) {


          var px = new Promise(function (resolve, reject) {
            if (fs.existsSync(program.dirdest)) {
              fs.mkdir(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's')
              resolve(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's')
            }
          });

          var p4 = new Promise(function (resolve, reject) {

            var formTemplate = fs.readFileSync(BASE_PATH + '/templates/kform.template').toString()

            var output = Mustache.render(formTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Form.jsx', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Form.jsx')) {
              resolve(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Form.jsx')
            }
            else {
              reject('form didnt created')
            }

          });

          var p5 = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/klist.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'List.jsx', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'List.jsx')) {
              resolve(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'List.jsx')
            }
            else {
              reject('form didnt created')
            }

          });

          var p6 = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/kindex.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Index.jsx', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Index.jsx')) {
              resolve(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Index.jsx')
            }
            else {
              reject('form didnt created')
            }

          });

          var p7 = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/kformatter.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Formatter.jsx', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Formatter.jsx')) {
              resolve(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Formatter.jsx')
            }
            else {
              reject('form didnt created')
            }

          });

          var p8 = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/kautocomplete.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Autocomplete.jsx', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Autocomplete.jsx')) {
              resolve(program.dirdest + '/' + mod + '/components/' + _str.startCase(mod) + 's/' + _str.startCase(mod) + 'Autocomplete.jsx')
            }
            else {
              reject('form didnt created')
            }

          });

        }

        if (folders.indexOf(program.dirdest + '/' + mod + '/resources') > -1) {

          var px = new Promise(function (resolve, reject) {
            if (fs.existsSync(program.dirdest)) {
              fs.mkdir(program.dirdest + '/' + mod + '/resources/messages')
              resolve(program.dirdest + '/' + mod + '/resources/messages')
            }
          });

          var p = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/kmessages.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/resources/messages/'+ _str.startCase(mod) + 'Messages.jsx', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/resources/messages/' + _str.startCase(mod) + 'Messages.jsx')) {
              resolve(program.dirdest + '/' + mod + '/resources/messages/' + _str.startCase(mod) + 'Messages.jsx')
            }
            else {
              reject('form didnt created')
            }

          });

        }


        if (folders.indexOf(program.dirdest + '/' + mod + '/stores') > -1) {

          var p9 = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/kstore.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/stores/' + _str.startCase(mod) + 'Store.js', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/stores/' + _str.startCase(mod) + 'Store.js')) {
              resolve(program.dirdest + '/' + mod + '/stores/' + _str.startCase(mod) + 'Store.js')
            }
            else {
              reject('form didnt created')
            }

          });

          var p10 = new Promise(function (resolve, reject) {

            var listTemplate = fs.readFileSync(BASE_PATH + '/templates/kdetailstore.template').toString()

            var output = Mustache.render(listTemplate, containerData);

            fs.writeFileSync(program.dirdest + '/' + mod + '/stores/'+ _str.startCase(mod) + 'DetailStore.js', output);

            if (fs.existsSync(program.dirdest + '/' + mod + '/stores/' + _str.startCase(mod) + 'DetailStore.js')) {
              resolve(program.dirdest + '/' + mod + '/stores/' + _str.startCase(mod) + 'DetailStore.js')
            }
            else {
              reject('form didnt created')
            }

          });

        }

      })
      .then(function () {
        console.log('module successfully created');
      })
      .catch(function (err) {
        console.log(err)
      })

  })
  .parse(process.argv);