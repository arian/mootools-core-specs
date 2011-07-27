define(['Core/Host/Array'], function(Array){
	
	describe('Array.forEach', function(){

		// disabled since Array.from does not exist
		xit('should call the function for each item in Function arguments', function(){
			var daysArr = [];
			(function(){
				Array.forEach(Array.from(arguments), function(value, key){
					daysArr[key] = value;
				});
			})('Sun','Mon','Tue');

			expect(daysArr).toEqual(['Sun','Mon','Tue']);
		});

		it('should call the function for each item in the array', function(){
			var daysArr = [];
			Array.forEach(['Sun','Mon','Tue'], function(value, i){
				daysArr.push(value);
			});

			expect(daysArr).toEqual(['Sun','Mon','Tue']);
		});

		it('should not iterate over deleted elements', function(){
			var array = [0, 1, 2, 3],
				testArray = [];
			delete array[1];
			delete array[2];

			Array.forEach(array, function(value){
				testArray.push(value);
			});

			expect(testArray).toEqual([0, 3]);
		});

	});

});