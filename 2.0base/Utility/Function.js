define(['Core/Utility/Function'], function(Utility){

	describe('Function.overloadSetter', function(){

		var collector, setter;
		beforeEach(function(){
			collector = {};
			setter = (function(key, value){
				collector[key] = value;
			});
		});

		it('should call a specific setter', function(){
			setter = Function.overloadSetter(setter);
			setter('key', 'value');

			expect(collector).toEqual({key: 'value'});

			setter({
				otherKey: 1,
				property: 2
			});

			expect(collector).toEqual({
				key: 'value',
				otherKey: 1,
				property: 2
			});

			setter({
				key: 3
			});
			setter('otherKey', 4);

			expect(collector).toEqual({
				key: 3,
				otherKey: 4,
				property: 2
			});
		});

		it('should only works with objects in plural mode', function(){
			setter = Function.overloadSetter(setter, true);

			setter({
				a: 'b',
				c: 'd'
			});

			expect(collector).toEqual({
				a: 'b',
				c: 'd'
			});
		});

	});

	describe('Function.overloadGetter', function(){

		var object, getter;
		beforeEach(function(){
			object = {
				a: 1,
				b: 2,
				c: 3
			};

			getter = (function(key){
				return object[key] || null;
			});
		});

		it('should call a getter for each argument', function(){
			getter = Function.overloadGetter(getter);

			expect(getter('a')).toEqual(1);
			expect(getter('b')).toEqual(2);
			expect(getter('c')).toEqual(3);
			expect(getter('d')).toBeNull();

			expect(getter('a', 'b', 'c')).toEqual(object);
			expect(getter(['a', 'b', 'c'])).toEqual(object);
			expect(getter(['a', 'c', 'd'])).toEqual({a: 1, c: 3, d: null});
		});

		it('should work in plural mode', function(){
			getter = Function.overloadGetter(getter, true);

			expect(getter('a')).toEqual({
				a: 1
			});
		
			expect(getter(['a', 'b'])).toEqual({
				a: 1,
				b: 2
			});
		})

	});

	describe('Function.from', function(){

		it('if a function is passed in that function should be returned', function(){
			var fn = function(a,b){ return a; };
			expect(Function.from(fn)).toEqual(fn);
		});
	
		it('should return a function that returns the value passed when called', function(){
			expect(Function.from('hello world!')()).toEqual('hello world!');
		});

	});

});
