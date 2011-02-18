/*
Specs for Events.js
License: MIT-style license.
*/

describe('Events', function(){

	describe('Events.listen', function(){

		it('should listen to a event', function(){
			var fn = jasmine.createSpy('foo');
			var events = new Events;
			events.listen('foo', fn);
			events.fire('foo');
			expect(fn).toHaveBeenCalled();
		});

		it('should listen to multiple events', function(){
			var fn1 = jasmine.createSpy('foo'), fn2 = jasmine.createSpy('bar');
			var events = new Events;
			events.listen('foo', fn1).listen('foo', fn2);
			events.fire('foo');
			expect(fn1).toHaveBeenCalled();
			expect(fn2).toHaveBeenCalled();
		});

		it('should only fire the events of the right type', function(){
			var fn1 = jasmine.createSpy('foo'),
				fn2 = jasmine.createSpy('moo'),
				fn3 = jasmine.createSpy('bar');
			var events = new Events;
			events.listen('foo', fn1).listen('foo', fn2).listen('bar', fn3);
			events.fire('foo');
			expect(fn1).toHaveBeenCalled();
			expect(fn2).toHaveBeenCalled();
			expect(fn3).not.toHaveBeenCalled();
		});

		it('should listen to multiple events with overloadSetter', function(){
			var fn1 = jasmine.createSpy('foo'),
				fn2 = jasmine.createSpy('moo'),
				fn3 = jasmine.createSpy('bar');
			var events = new Events;
			events.listen({
				foo: fn1,
				moo: fn2,
				bar: fn3
			}).fire('foo').fire('moo').fire('bar');
			expect(fn1).toHaveBeenCalled();
			expect(fn2).toHaveBeenCalled();
			expect(fn3).toHaveBeenCalled();
		});

	});

	describe('Events.ignore', function(){

		it('should ignore an event', function(){
			var fn = jasmine.createSpy('foo');
			var events = new Events;
			events.listen('foo', fn);
			events.ignore('foo', fn);
			events.fire('foo');
			expect(fn).not.toHaveBeenCalled();
		});

		it('should ignore all events of a type', function(){
			var fn1 = jasmine.createSpy('foo'),
				fn2 = jasmine.createSpy('moo');
			var events = new Events;
			events.listen('foo', fn1).listen('foo', fn2);
			events.ignore('foo');
			events.fire('foo');
			expect(fn1).not.toHaveBeenCalled();
			expect(fn2).not.toHaveBeenCalled();
		});

		it('should ignore all events', function(){
			var fn1 = jasmine.createSpy('foo'),
				fn2 = jasmine.createSpy('moo'),
				fn3 = jasmine.createSpy('bar');
			var events = new Events;
			events.listen({
				foo: fn1,
				moo: fn2,
				bar: fn3
			});
			events.ignore();
			events.fire('foo').fire('moo').fire('bar');
			expect(fn1).not.toHaveBeenCalled();
			expect(fn2).not.toHaveBeenCalled();
			expect(fn3).not.toHaveBeenCalled();
		});

	});

	describe('Events.fire', function(){

		it('should fire an event with arguments', function(){
			var fn = jasmine.createSpy('foo');
			var events = new Events;
			events.listen('bar', fn).fire('bar', 1, 2, 3);
			expect(fn).toHaveBeenCalledWith(1, 2, 3);
		});

	});

	describe('decorators', function(){

		var decorator = jasmine.createSpy('decorator'),
			decorator2 = jasmine.createSpy('decorator2'),
			onListen = jasmine.createSpy('onListen'),
			onIgnore = jasmine.createSpy('onIgnore');

		Events.defineDecorator('test', {
			listener: function(type, fn){
				decorator.apply(this, arguments);
				return function(){
					fn.apply(this, arguments);
				};
			},
			onListen: onListen,
			onIgnore: onIgnore
		}).defineDecorator('test2', {
			listener: function(type, fn){
				decorator2.apply(this, arguments);
				return fn.bind(this);
			}
		});

		it('should call the listener on listen', function(){
			var fn = function(){};
			var events = new Events;
			events.listen('foo:test', fn);
			expect(decorator).toHaveBeenCalled();
			expect(decorator.mostRecentCall.args[0]).toEqual('foo');
			expect(decorator.mostRecentCall.args[1]).toEqual(fn);
			expect(decorator.mostRecentCall.args[3]).toEqual(fn);
		});

		it('should fire a decorated event', function(){
			var fn = jasmine.createSpy('foo:test');
			var events = new Events;
			events.listen('foo:test', fn).fire('foo', 1, 2, 3);
			expect(fn).toHaveBeenCalledWith(1, 2, 3);
		});

		it('should decorate multiple times', function(){
			var fn = jasmine.createSpy('foo:test:test2');
			var events = new Events;
			events.listen('bar:test:test2', fn);
			expect(decorator2).toHaveBeenCalled();
			events.fire('bar', 1, 2, 3);
			expect(fn).toHaveBeenCalledWith(1, 2, 3);
		});

		it('should ignore a decorated event correctly', function(){
			var fn = jasmine.createSpy('foo:bind');
			var events = new Events;
			events.listen('bar:bind', fn);
			events.ignore('bar:bind', fn);
			events.fire('bar');
			expect(fn).not.toHaveBeenCalled();
		});

		it("should ignore a decorated event `bar:foo` by ignore('bar')", function(){
			var fn = jasmine.createSpy('foo:bind');
			var events = new Events;
			events.listen('bar:bind', fn);
			events.ignore('bar');
			events.fire('bar').fire('bar:bind');
			expect(fn).not.toHaveBeenCalled();
		});

		it('should call the onListen function', function(){
			var events = new Events;
			events.listen('moo:test', function(){});
			expect(onListen).toHaveBeenCalledWith('moo:test');
		});

		it('should call the onIgnore function', function(){
			var events = new Events;
			events.listen('ignore:test', function(){}).ignore('ignore');
			expect(onIgnore).toHaveBeenCalledWith('ignore:test');
		});

	});

	describe('shortcuts', function(){

		it('should add a shortcut', function(){
			Events.defineShortcut('smallnshort', 'someUglyLongEvent:bind');
			var fn = jasmine.createSpy('mooo');
			var events = new Events;
			events.listen('smallnshort', fn);
			events.fire('smallnshort');
			expect(fn).toHaveBeenCalled();
		});

	});

	describe('Predefined Decorators', function(){

		it('should bind the method to the event instance with :bind', function(){
			var events = new Events;
			var obj = {
				hello: function(){
					expect(this).toEqual(events);
				}
			}
			events.listen('foo:bind', obj.hello).fire('foo');
		});

		it('should fire the event only once with :once', function(){
			var events = new Events, count = 0;
			events.listen('bar:once', function(){
				count++;
			}).fire('bar');
			expect(count).toEqual(1);
			events.fire('bar');
			expect(count).toEqual(1);
			events.fire('bar');
			expect(count).toEqual(1);
		});

		it('should fire the event only once with :bind:once:bind', function(){
			var events = new Events, count = 0;
			events.listen('bar:bind:once:bind', function(){
				count++;
			}).fire('bar').fire('bar').fire('bar');
			expect(count).toEqual(1);
		});

	});

});
