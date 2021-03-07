'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "account", deps: []
 * createTable "categories", deps: []
 * createTable "categories_main", deps: []
 * createTable "products", deps: []
 * createTable "products_images", deps: []
 * createTable "store_analytics", deps: []
 * addIndex "PRIMARY" to table "account"
 * addIndex "PRIMARY" to table "categories"
 * addIndex "cat_parent" to table "categories"
 * addIndex "cat_user" to table "categories"
 * addIndex "PRIMARY" to table "categories_main"
 * addIndex "PRIMARY" to table "products"
 * addIndex "product_user" to table "products"
 * addIndex "product_cat" to table "products"
 * addIndex "PRIMARY" to table "products_images"
 * addIndex "product_id" to table "products_images"
 * addIndex "PRIMARY" to table "store_analytics"
 *
 **/

var info = {
    "revision": 1,
    "name": "shopwhats",
    "created": "2021-03-07T14:40:10.498Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "account",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "categories",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "categories_main",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "products",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "products_images",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "store_analytics",
            {

            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "account",
            [{
                "name": "id"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "categories",
            [{
                "name": "id"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "categories",
            [{
                "name": "cat_parent"
            }],
            {
                "indexName": "cat_parent"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "categories",
            [{
                "name": "cat_user"
            }],
            {
                "indexName": "cat_user"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "categories_main",
            [{
                "name": "id"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "products",
            [{
                "name": "id"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "products",
            [{
                "name": "product_user"
            }],
            {
                "indexName": "product_user"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "products",
            [{
                "name": "product_cat"
            }],
            {
                "indexName": "product_cat"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "products_images",
            [{
                "name": "id"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "products_images",
            [{
                "name": "product_id"
            }],
            {
                "indexName": "product_id"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "store_analytics",
            [{
                "name": "id"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
