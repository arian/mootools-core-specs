
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
	
	describe('appendChild', function(){
		
		it('should append an element into another element', function(){
			var el1 = new DOM.Element('div.first');
			var el2 = new DOM.Element('div.second');
			el1.appendChild(el2);
			expect(el1.contains(el2));
		});
		
		it('should append an element my ID', function(){
			var el1 = new DOM.Element('div#appendChild').inject(document.body);
			var el2 = new DOM.Element('div');
			el2.appendChild('appendChild');
			expect(el1.contains(el2));
			el1.eject();
		});
		
	});
	
	describe('get/setAttribute', function(){

		it('should set and get the attribute of an element', function(){
			var el = new DOM.Element('a');
			el.setAttribute('href', 'http://mootools.net');
			expect(el.getAttribute('href')).toEqual('http://mootools.net');
		});

	});

	describe('contains', function(){
		
		it('should return true when the elements contains another element (by ID)', function(){
			var node = document.createElement('div');
			node.innerHTML = '<span id="moo">yo</div>';
			var element = new DOM.Element(node).inject(document.body);
			expect(element.contains('moo')).toEqual(true);
			element.eject();
		});
		
		it('shoud return true for itself', function(){
			var el = new DOM.Element('div');
			expect(el.contains(el)).toEqual(true);
		});
		
		it('should return false when the element does not contain the other element', function(){
			var el1 = new DOM.Element('div').inject(document.body);
			var el2 = new DOM.Element('div').inject(document.body);
			expect(el1.contains(el2)).toEqual(false);
			el1.eject();
			el2.eject();
		});

	});

	describe('match', function(){
		
		it('should match an element by a CSS selector and return true', function(){
			var expressions = ['div', 'span.foo', 'a[href="#"'];
			for (var i = expressions.length; i--;){
				var el = new DOM.Element(expressions[i]);
				expect(el.match(expressions[i])).toEqual(true);
			}
		});

		it('should not match this element and return false', function(){
			var el = new DOM.Element('div');
			expect(el.match('span.foo')).toEqual(false);
		});

	});

	describe('toString for DOM.Element / DOM.Document / DOM.Window', function(){
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

	describe('injections / ejections', function(){

		describe('Element.inject', function(){

			var Container, test;

			beforeEach(function(){
				var html = [
					'<div id="first"></div>',
					'<div id="second">',
						'<div id="first-child"></div>',
						'<div id="second-child"></div>',
					'</div>'
				].join('');
				Container = new DOM.Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html});
				Container.inject(document.body);
				test = new DOM.Element('div', {id:'inject-test'});
			});

			afterEach(function(){
				Container.set('html', '').eject();
				Container = null;
				test = null;
			});

			it('should inject the Element before an Element', function(){
				test.inject(DOM.id('first'), 'before');
				expect(Container.toNode().childNodes[0]).toEqual(test.toNode());

				test.inject(DOM.id('second-child'), 'before');
				expect(Container.toNode().childNodes[1].childNodes[1]).toEqual(test.toNode());
			});

			it('should inject the Element after an Element', function(){
				test.inject(DOM.id('first'), 'after');
				expect(Container.toNode().childNodes[1]).toEqual(test.toNode());

				test.inject(DOM.id('first-child'), 'after');
				expect(Container.toNode().childNodes[1].childNodes[1]).toEqual(test.toNode());
			});

			it('should inject the Element at bottom of an Element', function(){
				var first = DOM.id('first');
				test.inject(first, 'bottom');
				expect(first.toNode().childNodes[0]).toEqual(test.toNode());

				var second = DOM.id('second');
				test.inject(second, 'bottom');
				expect(second.toNode().childNodes[2]).toEqual(test.toNode());

				test.inject(Container, 'bottom');
				expect(Container.toNode().childNodes[2]).toEqual(test.toNode());
			});

			it('should inject the Element at the top of an Element', function(){
				test.inject(Container, 'top');
				expect(Container.toNode().childNodes[0]).toEqual(test.toNode());

				var second = DOM.id('second');
				test.inject(second, 'top');
				expect(second.toNode().childNodes[0]).toEqual(test.toNode());
			});

			it('should inject the Element in an Element', function(){
				var first = DOM.id('first');
				test.inject(first);
				expect(first.toNode().childNodes[0]).toEqual(test.toNode());

				var second = DOM.id('second');
				test.inject(second);
				expect(second.toNode().childNodes[2]).toEqual(test.toNode());

				test.inject(Container);
				expect(Container.toNode().childNodes[2]).toEqual(test.toNode());
			});

		});

		describe('eject', function(){

			var Container;

			beforeEach(function(){
				Container = new DOM.Element('div').inject(document.body);
			});

			afterEach(function(){
				document.body.removeChild(Container.toNode());
				Container.set('html', '');
				Container = null;
			});

			it('should dispose the Element from the DOM', function(){
				var child = new DOM.Element('div').inject(Container);
				child.eject();
				expect(Container.toNode().childNodes.length).toEqual(0);
			});

		});

		describe('adopt', function(){

			var Container;

			beforeEach(function(){
				Container = new DOM.Element('div').inject(document.body);
			})

			afterEach(function(){
				document.body.removeChild(Container.toNode());
				Container.set('html', '');
				Container = null;
			});

			it('should adopt an Element by its id', function(){
				var child = new DOM.Element('div', {id: 'adopt-me'});
				child.inject(document.body);
				Container.adopt('adopt-me');
				expect(Container.toNode().childNodes[0]).toEqual(child.toNode());
			});

			it('should adopt an Element', function(){
				var child = new DOM.Element('p');
				Container.adopt(child);
				expect(Container.toNode().childNodes[0]).toEqual(child.toNode());
			});

			it('should adopt any number of Elements or ids', function(){
				var children = [], times = 100;
				while (times--){
					children.push(new DOM.Element('span', {id: 'child-' + times}));
				}
				Container.adopt.apply(Container, children);
				var node = Container.toNode();
				expect(node.childNodes.length).toEqual(children.length);
				expect(node.childNodes[10]).toEqual(children[10].toNode());
			});

		});


		describe('appendText', function(){

			var Container;

			beforeEach(function(){
				Container = new DOM.Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;'}).inject(document.body);
				var html = [
					'<div id="first"></div>',
					'<div id="second">',
						'<div id="first-child"></div>',
						'<div id="second-child"></div>',
					'</div>'
				].join('');
				Container.set('html', html);
			});

			afterEach(function(){
				document.body.removeChild(Container.toNode());
				Container.set('html', '');
				Container = null;
				test = null;
			});

			it('should append a TextNode before this Element', function(){
				DOM.id('first').appendText('test', 'before');
				expect(Container.toNode().childNodes[0].nodeValue).toEqual('test');

				DOM.id('second-child').appendText('test', 'before');
				expect(Container.toNode().childNodes[2].childNodes[1].nodeValue).toEqual('test');
			});

			it('should append a TextNode the Element after this Element', function(){
				DOM.id('first').appendText('test', 'after');
				expect(Container.toNode().childNodes[1].nodeValue).toEqual('test');

				DOM.id('first-child').appendText('test', 'after');
				expect(Container.toNode().childNodes[2].childNodes[1].nodeValue).toEqual('test');
			});

			it('should append a TextNode the Element at the bottom of this Element', function(){
				var first = DOM.id('first');
				first.appendText('test', 'bottom');
				expect(first.toNode().childNodes[0].nodeValue).toEqual('test');

				var second = DOM.id('second');
				second.appendText('test', 'bottom');
				expect(second.toNode().childNodes[2].nodeValue).toEqual('test');

				Container.appendText('test', 'bottom');
				expect(Container.toNode().childNodes[2].nodeValue).toEqual('test');
			});

			it('should append a TextNode the Element at the top of this Element', function(){
				Container.appendText('test', 'top');
				expect(Container.toNode().childNodes[0].nodeValue).toEqual('test');

				var second = DOM.id('second');
				second.appendText('test', 'top');
				expect(second.toNode().childNodes[0].nodeValue).toEqual('test');
			});

			it('should append a TextNode an Element in the Element', function(){
				var first = DOM.id('first').appendText('test');
				expect(first.toNode().childNodes[0].nodeValue).toEqual('test');

				var second = DOM.id('second').appendText('test');
				expect(second.toNode().childNodes[2].nodeValue).toEqual('test');

				Container.appendText('test');
				expect(Container.toNode().childNodes[2].nodeValue).toEqual('test');
			});

		});

		describe('grab', function(){

			var Container, test, containerNode, testNode;

			beforeEach(function(){
				var html = [
					'<div id="first"></div>',
					'<div id="second">',
						'<div id="first-child"></div>',
						'<div id="second-child"></div>',
					'</div>'
				].join('');
				Container = new DOM.Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html}).inject(document.body);
				containerNode = Container.toNode();
				test = new DOM.Element('div', {id:'grab-test'});
				testNode = test.toNode();
			});

			afterEach(function(){
				document.body.removeChild(containerNode);
				Container.set('html', '');
				Container = null;
				test = null;
			});

			it('should grab the Element before this Element', function(){
				DOM.id('first').grab(test, 'before');
				expect(containerNode.childNodes[0]).toEqual(testNode);

				DOM.id('second-child').grab(test, 'before');
				expect(containerNode.childNodes[1].childNodes[1]).toEqual(testNode);
			});

			it('should grab the Element after this Element', function(){
				DOM.id('first').grab(test, 'after');
				expect(containerNode.childNodes[1]).toEqual(testNode);

				DOM.id('first-child').grab(test, 'after');
				expect(containerNode.childNodes[1].childNodes[1]).toEqual(testNode);
			});

			it('should grab the Element at the bottom of this Element', function(){
				var first = DOM.id('first');
				first.grab(test, 'bottom');
				expect(first.toNode().childNodes[0]).toEqual(testNode);

				var second = DOM.id('second');
				second.grab(test, 'bottom');
				expect(second.toNode().childNodes[2]).toEqual(testNode);

				Container.grab(test, 'bottom');
				expect(containerNode.childNodes[2]).toEqual(testNode);
			});

			it('should grab the Element at the top of this Element', function(){
				Container.grab(test, 'top');
				expect(containerNode.childNodes[0]).toEqual(testNode);

				var second = DOM.id('second');
				second.grab(test, 'top');
				expect(second.toNode().childNodes[0]).toEqual(testNode);
			});

			it('should grab an Element in the Element', function(){
				var first = DOM.id('first').grab(test);
				expect(first.toNode().childNodes[0]).toEqual(testNode);

				var second = DOM.id('second').grab(test);
				expect(second.toNode().childNodes[2]).toEqual(testNode);

				Container.grab(test);
				expect(containerNode.childNodes[2]).toEqual(testNode);
			});

		});

		describe('replace', function(){
			
		});

		describe('wrap', function(){

		});

	});

});

describe('DOM.Elements', function(){
	
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


