
# **Mini-Framework**

## *Framework Documentation*

### **Top-Level Overview**

This custom framework was inspired by React, using the virtual DOM.  It provides a simple way to:

- Create elements
- Nest elements
- Add attributes
- Create events
- Remove elements

The virtual DOM also only updates the nodes and properties that need to be updated.  This means that resources are not spent rendering the entire page again and only necessary changes are made.


### **Code Examples**

##### Create Element

To create an element, all you need is the tag name, any attributes, and any children the element may have.  To create a header element with an id, we can do this:

`const header = CreateElement("h1", { attrs: { id: "myHeader" }, children: ["The Header"] });`

##### Add Attributes

To add attributes to an element, just input an object containing all of the attributes you want to add.  If we wanted to add a name and a class to the header element that we created above, we can do this:

`AddAttributesToElem(header, { name: "myHeader", class: "header" });`

##### Nest Elements

Say we wanted to put our newly created header element inside a `<div>` tag.  Then we would create the `<div>` element like so:

`const newDiv = CreateElement("div");`

Then we can nest our header element into it like this:

`NestElements(newDiv, header);`

There is also a third optional argument to allow you decide the positioning of the element within the parent element.  If the parent element already had 2 children, then you could specify the element to be nested between the two children like so:

`NestElements(newDic, header, 1);`

##### Create Events

To create an event for a particular element, we need to specify the action and then pass through the function to be executed when the action happens.  Lets say we want to print to the console when a user clicks on the `<div>` element we created earlier.  First we define the function:

`const printToConsole = (event) => {`
    `console.log("div has been clicked!");`
`}`

Then we can create the click event on our `<div>` element:

`CreateEvent(newDiv, "click", printToConsole);`

##### Remove Element

If we wanted to remove the header from the `<div>` then this is simple as well.  All we do is this:

`RemoveChildElement(newDiv, header);`

### **Explanation**

This framework concept is basic but efficient, and this largely thanks to its ability to only update and change things that need it.  

I chose to use the virtual DOM method as it was the easiest to visualise in my head.  Having a DOM in JSON format makes it simple to change and interact with.  The underlying functionality is just methods that you would use to interact with JavaScript objects but a lot more specific.
