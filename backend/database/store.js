// This is our simple, in-memory "database" for file logs.
// Since it's in its own module, any other file that imports it
// will get a reference to this exact same array.
const uploadedFilesLog = [];

module.exports = {
    uploadedFilesLog,
};