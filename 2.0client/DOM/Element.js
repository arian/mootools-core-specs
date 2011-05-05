
describe('DOM.Element', function(){
	
	describe('new DOM.Element', function(){

		it('should create a simple wrapped div element', function(){
			var element = new DOM.Element('div')
			expect(element.toNode().tagName.toLowerCase()).toEqual('div');
		});

		it('should create a div element when null is passed in the constructor', function(){
			var element = new DOM.Element();
			expect(element.toNode().tagName.toLowerCase()).toEqual('div');
		});
		
		it('should create a new element with an expression', function(){
			var element = new DOM.Element('div#myDiv.myClass');
			var node = element.toNode();
			expect(node.id).toEqual('myDiv');
			expect(node.className).toEqual('myClass');
		});

		it('should create a new element with id and class', function(){
			var p = new DOM.Element('p', {
				id: 'myParagraph',
				'class': 'test className'
			}).toNode();

			expect(p.tagName.toLowerCase()).toEqual('p');
			expect(p.className).toEqual('test className');
		});
		
		it('should subclass DOM.Element with the Matches mutator', function(){
			DOM.Element.SPAN = new Class({
				Extends: DOM.Element,
				Matches: 'span',
				initialize: function(node, props){
					this.parent(node, props, true);
					this.set('id', 'DOM.Element.SPAN');
				}
			});
			var element = new DOM.Element('span.foo#yo');
			expect(element instanceof DOM.Element.SPAN).toEqual(true);
			expect(element.toNode().id).toEqual('DOM.Element.SPAN');
		});
		
		it('should wrap an exiting real node', function(){
			var node = document.createElement('a');
			var element = new DOM.Element(node);
			expect(element.toNode()).toEqual(node);
		});

		it('should create an element from an object which has a toElement method', function(){
			var el = new DOM.Element('em');
			var obj = {
				toElement: function(){
					return el;
				}
			};
			var obj2 = {
				toElement: function(){
					return el.toNode();
				}
			}
			var element = new DOM.Element(obj);
			expect(element).toEqual(el);
			var element2 = new DOM.Element(obj2);
			expect(element2).toEqual(el)
		});

	});

	describe('DOM.Element / DOM.Document / DOM.Window toString', function(){
		expect(new DOM.Element('div#yo.bar').toString()).toEqual('<div#yo.bar>');
		expect(new DOM.Element('div', {
			'class': 'bar foo tmp'
		}).toString()).toEqual('<div.bar.foo.tmp>');
		expect(DOM.document.toString()).toEqual('<document>');
		expect(DOM.window.toString()).toEqual('<window>');
	});

	describe('Classes', function(){

		it('should set the class', function(){
			var el = new DOM.Element('div').set('class', 'foo bar');
			expect(el.toNode().className).toEqual('foo bar');
		});
	
		it('should return true if the Element has the given class', function(){
			var div = new DOM.Element('div', {'class': 'header bold'});
			expect(div.hasClass('header')).toBeTruthy();
			expect(div.hasClass('bold')).toBeTruthy();
			expect(div.hasClass('random')).toBeFalsy();
		});

		it('should add the class to the Element', function(){
			var div = new DOM.Element('div');
			div.addClass('myclass');
			expect(div.hasClass('myclass')).toBeTruthy();
		});

		it('should append classes to the Element', function(){
			var div = new DOM.Element('div', {'class': 'myclass'});
			div.addClass('aclass');
			expect(div.hasClass('aclass')).toBeTruthy();
		});

		it('should remove the class in the Element', function(){
			var div = new DOM.Element('div', {'class': 'myclass'});
			div.removeClass('myclass');
			expect(div.hasClass('myclass')).toBeFalsy();
		});

		it('should only remove the specific class', function(){
			var div = new DOM.Element('div', {'class': 'myclass aclass'});
			div.removeClass('myclass');
			expect(div.hasClass('myclass')).toBeFalsy();
		});

		it('should not remove any class if the class is not found', function(){
			var div = new DOM.Element('div', {'class': 'myclass'});
			div.removeClass('extra');
			expect(div.hasClass('myclass')).toBeTruthy();
		});

		it('should add the class if the Element does not have the class', function(){
			var div = new DOM.Element('div');
			div.toggleClass('myclass');
			expect(div.hasClass('myclass')).toBeTruthy();
		});

		it('should remove the class if the Element does have the class', function(){
			var div = new DOM.Element('div', {'class': 'myclass'});
			div.toggleClass('myclass');
			expect(div.hasClass('myclass')).toBeFalsy();
		});

	});

});

describe('DOM.id', function(){

	xit('should find IDs with special characters', function(){
		var element = new DOM.Element('div#id\\.part.class').inject(document.body);

		var found = DOM.id('id.part');
		expect(found).toBe(element);
		expect(found.get('id')).toBe('id.part');
		expect(found.get('class')).toBe('class');

		element.eject();

		element = new Element('div#id\\#part').inject(document.body);

		found = DOM.id('id#part');
		expect(found).toBe(element);
		expect(found.get('id')).toBe('id#part');
	});

});


