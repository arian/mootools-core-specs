define(['Core/Host/Date', 'Core/Utility/typeOf'], function(Date, typeOf){
	
	describe('Date.now', function(){

		it('should return a timestamp', function(){
			expect(typeOf(Date.now()) == 'number').toBeTruthy();
		});

	});

});