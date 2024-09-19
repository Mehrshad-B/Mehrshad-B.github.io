const Sequelize = require('sequelize');
/*var posts = [];
var categories = [];
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;*/
const { gte } = Sequelize.Op;

var sequelize = new Sequelize('yaxnykwr', 'yaxnykwr', 'xD-uTVpUhKczvG5enOlJIk1pdyZpCu5Z', {
    host: 'ruby.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
}, {
    createdAt: false,
    updatedAt: false
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
});

Post.belongsTo(Category, { foreignKey: 'category' });

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            console.log('Database synced successfully.');
            resolve();
        }).catch(function(err) {
            console.error('Unable to sync the database:' + err);
            reject();
        });
    });
};

module.exports.getAllPosts = function() {
    return new Promise(function(resolve, reject) {
        Post.findAll().then(function(data) {
            resolve(data)
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPosts = function() {
    return new Promise(function(resolve, reject) {
        Post.findAll({ where: { published: true } }).then(function(data) {
            resolve(data);
        }).catch(function(err) {
            reject("no results returned");
        })
    });
}

module.exports.getPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { category: category } }).then(function(data) {
            resolve(data);
        }).catch(function(err) {
            reject("no results returned");
        })
    })
}

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(function(data) {
            resolve(data);
        }).catch(function(err) {
            reject("no results returned");
        })
    })
}

module.exports.getCategories = function() {
    return new Promise(function(resolve, reject) {
        Category.findAll().then(function(data) {
            resolve(data);
        }).catch(function(err) {
            reject("no results returned");
        })
    })
}

module.exports.getPostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { id: id } }).then(function(data) {
            resolve(data[0]);
        }).catch(function(err) {
            reject("no results returned");
        })
    })
}

module.exports.addPost = function(postData) {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (let prop in postData) {
            if (postData[prop] === "") {
                postData[prop] = null;
            }
        }
        postData.postDate = new Date();

        Post.create(postData).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to create post");
        })


    })
}

module.exports.getPublishedPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { category: category, published: true } }).then(function(data) {
            resolve(data);
        }).catch(function(err) {
            reject("no results returned");
        })
    })
}

module.exports.addCategory = function(categoryData) {
    return new Promise((resolve, reject) => {
        for (let prop in categoryData) {
            if (categoryData[prop] === "") {
                categoryData[prop] = null;
            }
        }

        Category.create(categoryData).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to create category");
        })
    })
}

module.exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        Category.destroy({ where: { id: id } }).then(() => {
            console.log("CATEGORY DELETED")
            resolve()
        }).catch((err) => {
            console.log("CATEGORY DELETION FAILED")
            reject(err)
        })
    })
}

module.exports.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.destroy({ where: { id: id } }).then(() => {
            console.log("POST DELETED")
            resolve()
        }).catch((err) => {
            console.log("POST DELETION FAILED")
            reject(err)
        })
    })
}