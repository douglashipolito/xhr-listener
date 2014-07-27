if (!Array.prototype.forEach) {
// Array.prototype.forEach
Array.prototype.forEach = function forEach(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		callback.call(scope || window, array[index], index, array);
	}
};

}
if (!Array.prototype.indexOf) {
// Array.prototype.indexOf
Array.prototype.indexOf = function indexOf(searchElement) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		if (array[index] === searchElement) {
			return index;
		}
	}

	return -1;
};

}
if (typeof Object !== "undefined" && !Object.create) {
// Object.create
Object.create = function create(prototype, properties) {
	if (typeof prototype !== 'object') {
		throw new Error('Object prototype may only be an Object or null');
	}

	var Constructor = function () {};

	Constructor.prototype = prototype;

	var object = new Constructor();

	Object.defineProperties(object, properties);

	return object;
};

}
if (typeof Object !== "undefined" && !Object.defineProperties) {
// Object.defineProperties
Object.defineProperties = function defineProperties(object, descriptors) {
	for (var property in descriptors) {
		Object.defineProperty(object, property, descriptors[property]);
	}

	return object;
};

}
