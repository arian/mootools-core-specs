define(['Core/Utility/Object'], function(Object){

	describe('Object.forEach', function(){

		it('should call the function for each item in the object', function(){
			var daysObj = {};
			Object.forEach({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
				daysObj[key] = value;
			});

			expect(daysObj).toEqual({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
		});

		it('should ignore the prototype chain', function(){
			var fn = function(){};
			fn.prototype = {a: 1};

			var object = new fn;
			object.b = 2;

			var items = {};
			Object.forEach(object, function(value, key){
				items[key] = value;
			});

			expect(items).toEqual({b: 2});
		});

	});

});