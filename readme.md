whichTriangle.js
================
A small jQuery plugin that helps you divide an element into four triangles and test co-ordinates on them.
Did you say [demo](http://experiments.muditameta.com/whichTriangle/)?

Installation
----------------
- Download either `whichTriangle.js` or `whichTriangle.min.js`  
- Add it after you include `jQuery`
- You're ready to go!

Usage
----------------
#### Setup

```javascript
$( selector ).setupTriangle()
```
`element.setupTriangle()` sets up the triangles for the element its called on.   
It returns the `element` so it can be chained.

#### Test co-ordinates

```javascript
$( selector ).whichTriangle( event )
```

`element.whichTriangle( event )` is passed one parameter:

- `event` is the event object that is available to any event handler. Internally, it extracts the client co-ordinates
from the event object and returns which triangle those co-ordinates fall in. If they don't fall in any triangle then it 
returns `-1`.
- It returns `0` for `top` triangle
- It returns `1` for `right` triangle
- It returns `2` for `bottom` triangle
- It returns `3` for `left` triangle
- It returns `-1` when co-ordinates outside triangles

#### Update triangle

```javascript
$( selector ).updateTriangle()
```
`element.updateTriangle()` updates the co-ordinates that describe the triangles for the element. This is required when
the dimensions and/or position of the element changes.

With this you can easily build things like direction sensitive hovers, direction sensitive interactions, etc.

See the example in the `examples` directory for more clarity.

## Support
__Chrome, Firefox 3.0+, IE6+, Safari 4.0+, Opera 10.0+__

## Note

- `.whichTriangle( event )` doesn't support chaining as it returns a `number` value.
- To use with IE < 9 use jQuery <= 1.7.0
