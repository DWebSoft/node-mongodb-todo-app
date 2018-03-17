var env = process.env.NODE_ENV || 'development';
console.log(`env **** ${env}`);

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoTestApp";
} else if (env === 'production') {
    process.env.MONGODB_URI = "mongodb://durgesh@ds115579.mlab.com:15579/durgesh-todo";
}