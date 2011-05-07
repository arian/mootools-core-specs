
describe('DOM.Element', function(){

	describe('new DOM.Element', function(){

		// Also port the newElement.js specs from 1.3

		it('should create a simple wrapped div element', function(){
			var element = new DOM.Element('div')
			expect(element.toNode().tagName.toLowerCase()).toEqual('div');
		});

		it('should create a div element when null is passed in the constructor', function(){
			var element = new DOM.Element();
			expect(element.toNode().tagName.toLowerCase()).toEqual('div');
		});

		it('should return an Element with various attributes', function(){
			var element = new DOM.Element('div', { 'id': 'divID', 'title': 'divTitle' });
			expect(element.node.id).toEqual('divID');
			expect(element.node.title).toEqual('divTitle');
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
			DOM.Element.B = new Class({
				Extends: DOM.Element,
				Matches: 'b',
				initialize: function(node, props){
					var self = this.parent(node, props, true);
					this.set('id', 'DOM.Element.B');
					return self;
				}
			});
			var element = new DOM.Element('b.foo#yo');
			expect(element instanceof DOM.Element.B).toEqual(true);
			expect(element.toNode().id).toEqual('DOM.Element.B');
		});

		it('should wrap an existing real node', function(){
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

		it('should return the same instance for the same node', function(){
			var node = document.createElement('a');
			expect(new DOM.Element(node)).toEqual(new DOM.Element(node));
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
				Container.adopt(children);
				var node = Container.toNode();
				expect(node.childNodes.length).toEqual(children.length);
				expect(node.childNodes[10]).toEqual(children[10].toNode());
			});

			it("adopting should not change the parent of the element doing the adopting", function(){
				var baldGuy = new DOM.Element('div');
				var annie = new DOM.Element('span');

				gramps = baldGuy.getParent();
				baldGuy.adopt(annie);
				expect(baldGuy.getParent()).toEqual(gramps)
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
			it('should replace an Element with the Element', function(){
				var parent = new DOM.Element('div');
				var div = new DOM.Element('div', {id: 'original'}).inject(parent);
				var el = new DOM.Element('div', {id: 'replaced'});
				el.replace(div);
				expect(parent.toNode().childNodes[0]).toEqual(el.toNode());
			});
		});

		describe('wrap', function(){
			it('should replace and adopt the Element', function(){
				var div = new DOM.Element('div'), divNode = div.toNode();
				var child = new DOM.Element('p').inject(div), childNode = child.toNode();

				var wrapper = new DOM.Element('div', {id: 'wrapper'}).wrap(child),
					wrapperNode = wrapper.toNode();
	
				expect(divNode.childNodes[0]).toEqual(wrapperNode);
				expect(wrapperNode.childNodes[0]).toEqual(childNode);
			});
		});

	});

	describe('Tree Walking', function(){


		describe('getPrevious', function(){

			it('should return the previous Element, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[1].getPrevious()).toEqual(children[0]);
				expect(children[0].getPrevious()).toBeNull();
			});

			it('should return the previous Element that matches, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('a'), new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[1].getPrevious('a')).toEqual(children[0]);
				expect(children[1].getPrevious('span')).toBeNull();
			});

		});

		describe('getAllPrevious', function(){

			it('should return all the previous DOM.Elements, otherwise an empty array', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[2].getAllPrevious()).toEqual(new DOM.Elements([children[1], children[0]]));
				expect(children[0].getAllPrevious().length).toEqual(0);
			});

			it('should return all the previous DOM.Elements that match, otherwise an empty array', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('a'), new DOM.Element('div'), new DOM.Element('a'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[3].getAllPrevious('a')).toEqual(new DOM.Elements([children[2], children[0]]));
				expect(children[1].getAllPrevious('span')).toEqual(new DOM.Elements([]));
			});

		});

		describe('getNext', function(){

			it('should return the next DOM.Element, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[1].getNext()).toEqual(children[2]);
				expect(children[2].getNext()).toBeNull();
			});

			it('should return the previous DOM.Element that matches, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('a')];
				container.adopt(children);
				expect(children[1].getNext('a')).toEqual(children[3]);
				expect(children[1].getNext('span')).toBeNull();
			});

		});

		describe('getAllNext', function(){

			it('should return all the next DOM.Elements, otherwise an empty array', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[0].getAllNext()).toEqual(new DOM.Elements(children.slice(1)));
				expect(children[2].getAllNext()).toEqual(new DOM.Elements([]));
			});

			it('should return all the next DOM.Elements that match, otherwise an empty array', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('a'), new DOM.Element('div'), new DOM.Element('a')];
				container.adopt(children);
				expect(children[0].getAllNext('a')).toEqual(new DOM.Elements([children[1], children[3]]));
				expect(children[0].getAllNext('span')).toEqual(new DOM.Elements([]));
			});

		});

		describe('getFirst', function(){

			it('should return the first DOM.Element in the DOM.Element, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('a'), new DOM.Element('div')];
				container.adopt(children);
				expect(container.getFirst()).toEqual(children[0]);
				expect(children[0].getFirst()).toBeNull();
			});

		});

		describe('getLast', function(){

			it('should return the last DOM.Element in the DOM.Element, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('a'), new DOM.Element('div')];
				container.adopt(children);
				expect(container.getLast()).toEqual(children[2]);
				expect(children[0].getLast()).toBeNull();
			});

			it('should return the last DOM.Element in the DOM.Element that matches, otherwise null', function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('a'), new DOM.Element('div'), new DOM.Element('a')];
				container.adopt(children);
				expect(container.getLast('a')).toEqual(children[3]);
				expect(container.getLast('span')).toBeNull();
			});

		});

		describe('getParent', function(){

			it('should return the parent of the DOM.Element, otherwise null', function(){
				var container = new DOM.Element('p');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(children[1].getParent()).toEqual(container);
				expect(container.getParent()).toBeNull();
			});

			it('should return the parent of the DOM.Element that matches, otherwise null', function(){
				var container = new DOM.Element('p');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(new DOM.Element('div').adopt(children));
				expect(children[1].getParent('p')).toEqual(container);
				expect(children[1].getParent('table')).toBeNull();
			});

		});

		describe('getParents', function(){

			it('should return the parents of the DOM.Element, otherwise returns an empty array', function(){
				var container = new DOM.Element('p');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(new DOM.Element('div').adopt(new DOM.Element('div').adopt(children)));
				expect(children[1].getParents()).toEqual(new DOM.Elements([container.getFirst().getFirst(), container.getFirst(), container]));
				expect(container.getParents()).toEqual(new DOM.Elements([]));
			});

			it('should return the parents of the DOM.Element that match, otherwise returns an empty array', function(){
				var container = new DOM.Element('p');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(new DOM.Element('div').adopt(new DOM.Element('div').adopt(children)));
				expect(children[1].getParents('div')).toEqual(new DOM.Elements([container.getFirst().getFirst(), container.getFirst()]));
				expect(children[1].getParents('table')).toEqual(new DOM.Elements([]));
			});

		});

		describe('getChildren', function(){

			it("should return the DOM.Element's children, otherwise returns an empty array", function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('div'), new DOM.Element('div')];
				container.adopt(children);
				expect(container.getChildren()).toEqual(new DOM.Elements(children));
				expect(children[0].getChildren()).toEqual(new DOM.Elements([]));
			});

			it("should return the DOM.Element's children that match, otherwise returns an empty array", function(){
				var container = new DOM.Element('div');
				var children = [new DOM.Element('div'), new DOM.Element('a'), new DOM.Element('a')];
				container.adopt(children);
				expect(container.getChildren('a')).toEqual(new DOM.Elements([children[1], children[2]]));
				expect(container.getChildren('span')).toEqual(new DOM.Elements([]));
			});

		});

	});

	describe('Attribute Getters', function(){

		// Special Getters

		it("should return a CSS string representing the Element's styles", function(){
			var style = 'font-size:12px;color:rgb(255,255,255)';
			var myElement = new DOM.Element('div').set('style', style);
			expect(myElement.get('style').toLowerCase().replace(/\s/g, '').replace(/;$/, '')).toMatch(/(font-size:12px;color:rgb\(255,255,255\))|(color:rgb\(255,255,255\);font-size:12px)/);
			//I'm replacing these characters (space and the last semicolon) as they are not vital to the style, and browsers sometimes include them, sometimes not.
		});

		it("should return the Element's tag", function(){
			var myElement = new DOM.Element('div');
			expect(myElement.get('tag')).toEqual('div');
		});

		it("should get an absolute href", function(){
			var link = new DOM.Element('a', {href: "http://google.com/"});
			expect(link.get('href')).toEqual("http://google.com/");
		});

		it("should get an absolute href to the same domain", function(){
			var link = new DOM.Element('a', {href: window.location.href});
			expect(link.get('href')).toEqual(window.location.href);
		});

		it("should get a relative href", function(){
			var link = new DOM.Element('a', {href: "../index.html"});
			expect(link.get('href')).toEqual("../index.html");
		});

		it("should get a host absolute href", function(){
			var link = new DOM.Element('a', {href: "/developers"});
			expect(link.get('href')).toEqual("/developers");
		});

		it("should return null when attribute is missing", function(){
			var link = new DOM.Element('a');
			expect(link.get('href')).toBeNull();
		});

		// Properties

		it('should get href from an Element', function(){
			var anchor1 = new DOM.Element('a');
			anchor1.node.href = 'http://mootools.net';
			expect(anchor1.get('href')).toEqual('http://mootools.net');

			var anchor2 = new DOM.Element('a');
			anchor2.node.href = '#someLink';
			expect(anchor2.get('href')).toEqual('#someLink');
		});

		it('should get type (boolean) of an input Element', function(){
			var input1 = new DOM.Element('input', {type: 'text'});
			expect(input1.get('type')).toEqual('text');

			var input2 = new DOM.Element('input', {type: 'checkbox'});
			expect(input2.get('type')).toEqual('checkbox');

			var div = new DOM.Element('div', {'html':
				'<select name="test" id="test" multiple="multiple">' +
					'<option value="1">option-value</option>' +
				'</select>'
			});
			var input3 = div.find('select');
			expect(input3.get('type')).toEqual('select-multiple');
			expect(input3.get('name')).toEqual('test');
		});

		it('should get checked (boolean) from an input Element', function(){
			var checked1 = new DOM.Element('input', { type: 'checkbox' });
			checked1.node.checked = 'checked';
			expect(checked1.get('checked')).toEqual(true);

			var checked2 = new DOM.Element('input', { type: 'checkbox' });
			checked2.node.checked = true;
			expect(checked2.get('checked')).toEqual(true);

			var checked3 = new DOM.Element('input', { type: 'checkbox' });
			checked3.node.checked = false;
			expect(checked3.get('checked')).toEqual(false);
		});

		it('should get disabled (boolean) from an input Element', function(){
			var disabled1 = new DOM.Element('input', { type: 'text' });
			disabled1.node.disabled = 'disabled';
			expect(disabled1.get('disabled')).toEqual(true);

			var disabled2 = new DOM.Element('input', { type: 'text' });
			disabled2.node.disabled = true;
			expect(disabled2.get('disabled')).toEqual(true);

			var disabled3 = new DOM.Element('input', { type: 'text' });
			disabled3.node.disabled = false;
			expect(disabled3.get('disabled')).toEqual(false);
		});

		it('should get readonly (boolean) from an input Element', function(){
			var readonly1 = new DOM.Element('input', { type: 'text' });
			readonly1.node.readonly = 'readonly';
			expect(readonly1.get('readonly')).toEqual(true);

			var readonly2 = new DOM.Element('input', { type: 'text' });
			readonly2.node.readonly = true;
			expect(readonly2.get('readonly')).toEqual(true);

			var readonly3 = new DOM.Element('input', { type: 'text' });
			readonly3.node.readonly = false;
			expect(readonly3.get('readonly')).toEqual(false);
		});

	});

	describe('Attribute Setters', function(){

		it("should set a single attribute of an Element", function(){
			var div = new DOM.Element('div').set('id', 'some_id');
			expect(div.node.id).toEqual('some_id');
		});

		it("should set the checked attribute of an Element", function(){
			var input1 = new DOM.Element('input', {type: 'checkbox'}).set('checked', 'checked');
			var input2 = new DOM.Element('input', {type: 'checkbox'}).set('checked', true);
			expect(input1.node.checked).toBeTruthy();
			expect(input2.node.checked).toBeTruthy();
		});

		it("should set the class name of an element", function(){
			var div = new DOM.Element('div').set('class', 'some_class');
			expect(div.node.className).toEqual('some_class');
		});

		it("should set the for attribute of an element", function(){
			var input = new DOM.Element('label', {type: 'text'}).set('for', 'some_element');
			expect(input.node.htmlFor).toEqual('some_element');
		});

		it("should set the html of an Element", function(){
			var html = '<a href="http://mootools.net/">Link</a>';
			var parent = new DOM.Element('div').set('html', html);
			expect(parent.node.innerHTML.toLowerCase()).toEqual(html.toLowerCase());
		});

		it("should set the html of an Element with multiple arguments", function(){
			var html = ['<p>Paragraph</p>', '<a href="http://mootools.net/">Link</a>'];
			var parent = new DOM.Element('div').set('html', html);
			expect(parent.node.innerHTML.toLowerCase()).toEqual(html.join('').toLowerCase());
		});

		it("should set the html of a select Element", function(){
			var html = '<option>option 1</option><option selected="selected">option 2</option>';
			var select = new DOM.Element('select').set('html', html);
			expect(select.getChildren().length).toEqual(2);
			expect(select.node.options.length).toEqual(2);
			expect(select.node.selectedIndex).toEqual(1);
		});

		it("should set the html of a table Element", function(){
			var html = '<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr></tbody>';
			var table = new DOM.Element('table').set('html', html);
			expect(table.getChildren().length).toEqual(1);
			expect(table.getFirst().getFirst().getChildren().length).toEqual(2);
			expect(table.getFirst().getLast().getFirst().node.className).toEqual('cell');
		});

		it("should set the html of a tbody Element", function(){
			var html = '<tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr>';
			var tbody = new DOM.Element('tbody').inject(new DOM.Element('table')).set('html', html);
			expect(tbody.getChildren().length).toEqual(2);
			expect(tbody.getLast().getFirst().node.className).toEqual('cell');
		});

		it("should set the html of a tr Element", function(){
			var html = '<td class="cell">cell 1</td><td>cell 2</td>';
			var tr = new DOM.Element('tr').inject(new DOM.Element('tbody').inject(new DOM.Element('table'))).set('html', html);
			expect(tr.getChildren().length).toEqual(2);
			expect(tr.getFirst().node.className).toEqual('cell');
		});

		it("should set the html of a td Element", function(){
			var html = '<span class="span">Some Span</span><a href="#">Some Link</a>';
			var td = new DOM.Element('td').inject(new DOM.Element('tr').inject(new DOM.Element('tbody').inject(new DOM.Element('table')))).set('html', html);
			expect(td.getChildren().length).toEqual(2);
			expect(td.getFirst().node.className).toEqual('span');
		});

		it("should set the style attribute of an Element", function(){
			var style = 'font-size:12px;line-height:23px;';
			var div = new DOM.Element('div').set('style', style);
			expect(div.node.style.lineHeight).toEqual('23px');
			expect(div.node.style.fontSize).toEqual('12px');
		});

		it("should set the text of an element", function(){
			var div = new DOM.Element('div').set('text', 'some text content');
			expect(div.get('text')).toEqual('some text content');
			expect(div.node.innerHTML).toEqual('some text content');
		});

		it("should set multiple attributes of an Element", function(){
			var div = new DOM.Element('div').set({ id: 'some_id', 'title': 'some_title', 'html': 'some_content' });
			var node = div.node;
			expect(node.id).toEqual('some_id');
			expect(node.title).toEqual('some_title');
			expect(node.innerHTML).toEqual('some_content');
		});

		it("should set various attributes of a script Element", function(){
			var script = new DOM.Element('script').set({ type: 'text/javascript', defer: 'defer' });
			var node = script.node;
			expect(node.type).toEqual('text/javascript');
			expect(node.defer).toEqual(true);
		});

		it("should set various attributes of a table Element", function(){
			var table1 = new DOM.Element('table').set({ border: '2', cellpadding: '3', cellspacing: '4', align: 'center' });
			var table2 = new DOM.Element('table').set({ cellPadding: '3', cellSpacing: '4' });
			expect(table1.node.border == 2).toBeTruthy();
			expect(table1.node.cellPadding == 3).toBeTruthy();
			expect(table2.node.cellPadding == 3).toBeTruthy();
			expect(table1.node.cellSpacing == 4).toBeTruthy();
			expect(table2.node.cellSpacing == 4).toBeTruthy();
			expect(table1.node.align).toEqual('center');
		});

	});

});

describe('DOM.Elements', function(){

});

describe('DOM.id', function(){

	it('should find IDs with special characters', function(){
		var element = new DOM.Element('div#id\\.part.class').inject(document.body);

		var found = DOM.id('id.part');
		expect(found).toEqual(element);
		expect(found.get('id')).toBe('id.part');
		expect(found.get('class')).toBe('class');

		element.eject();

		element = new DOM.Element('div#id\\#part').inject(document.body);

		found = DOM.id('id#part');
		expect(found).toEqual(element);
		expect(found.get('id')).toBe('id#part');
	});

});


