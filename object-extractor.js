/*
 * Object Values Extractor
 *
 * This module is meant to convert any JavaScript object to a single string.
 * The string can be copied and pasted to a text editor to make it easy to 
 * search the JavaScript object. The text editor search functionality can be
 * used.
 *
 * Even objects with a circular structure can be handled by this code.
 * 
 * Output for circular structures can be displayed or blocked depending on 
 * the value of the second boolean function argument.
 *
 * This was coded as a function to hide its variables from the window 
 * object. When testing this code with the window object, the variables 
 * in this code distracted from the rest of window object structure.
 */

function extractObject(givenObj, showCircular)
{
    "use strict";

    var queue = [];
    var stack = [];
    var currentObj = {};
    var key, val;
    
    var objNames = [];
    var objLevels = [];
    
    var objName, objLevel;
    
    var circularIndex;
    
    var parentIdById = [];
    var objectById = [];
    var objPathById = [];
    var idSequence = 0;
    var parentId, ancestorId;
    var nextPath;
    var currentId = [];
    
    var topObjectName = "{Top Object}";

    var allText = "";

    if (typeof givenObj === "object")
    {
        queue.push(givenObj);
        objNames.push(topObjectName);
        
        objLevels.push(1);
        
        // keep track of all objects by a unique ID
        // link each child object ID to its parent ID
        // link each object to its ID
        
        currentId.push(idSequence);
        parentIdById[idSequence] = -1;  // parent of top object has invalid ID
        objectById[idSequence] = givenObj;
        objPathById[idSequence] = topObjectName + "/ Level: 1";
    }

    // use first in, first out (FIFO) queue to store
    // object properties that are themselves objects

    while (queue.length > 0)
    {
        currentObj = queue.shift();
        objName = objNames.shift();
        objLevel = objLevels.shift();
        parentId = currentId.shift();        

        allText += objName + "/ Level: " + objLevel + "\n";
        
        for (key in currentObj)
        {
            if (currentObj.hasOwnProperty(key))
            {
                val = currentObj[key];
                if (typeof val === "object")
                {
                    ancestorId = getCircularAncestorId(parentId, val, objectById, parentIdById);
                    
                    if ( ancestorId >= 0 )
                    {
                        if (showCircular) // get first object path
                        {
                            allText += "\"" + key + "\": {circular} Same as: "; 
                            allText += objPathById[ancestorId] + "\n";
                        }
                    }
                    else
                    {
                        allText += "\"" + key + "\": {object}\n";
                        
                        queue.push(val);
                        nextPath = objName + "/" + key;
                        objNames.push(nextPath);
                        objLevels.push(objLevel + 1);

                        idSequence += 1;                        
                        currentId.push(idSequence);
                        parentIdById[idSequence] = parentId;
                        objectById[idSequence] = val;
                        objPathById[idSequence] = nextPath + "/ Level: " + (objLevel + 1);
                    }
                }
                else if (typeof val === "function")
                {
                    allText += "\"" + key + "\": <function()>\n";
                }
                else if (typeof val === "string")
                {
                    val = "\"" + val + "\"";
                    allText += "\"" + key + "\": " + val + "\n";
                }
                else
                {
                    allText += "\"" + key + "\": " + val + "\n";
                }
            }
        }
        
        allText += "\n";
    }

    return allText;
}

/*
 * If an object is the same as its parent or any ancestor,
 * then the object has a circular structure.
 *
 * This function returns the id of the ancestor object that's 
 * circular or -1 if the object isn't a circular reference.
 */

function getCircularAncestorId(parentId, obj, objectById, parentIdById)
{
    var ancestorObj = objectById[parentId];

    while (parentId >= 0)
    {
        if (obj === ancestorObj)
        {
            break; // circular structure found
        }
        else
        {
            parentId = parentIdById[parentId];
            ancestorObj = objectById[parentId];
        }
    }
    
    return parentId;
}

//var givenObj = {"first": 1, "second": 2, "third": 3};

//var funny = function() { return; };
//var givenObj = {"one": "one", "fun": funny};

//var givenObj = {"one": 1, "two": 2, "more": {"three": 3, "four": 4}};

//var givenObj = {"pre": {"i": 0, "ii": -1, "iii": -2}, "a": 1, "b": 2, "more": {"c": 3, "d": 4}, "extra": {"e": 5, "f": 6}};

/*
var givenObj = {
    "arr1": ['a', 'b', 'c'],
    "arr2": [true, 4, "seven"],
    "obj1": {"a": "a", "b": "b", "c": "c"}
};
*/

//var givenObj = {"arr3": [{"name": "Nippy", "age": 3}, {"name": "Bozzy", "age": 1}, {"name": "Dinky", "age": 7}]};

/*
var givenObj = 
    [
        {"arr1": [{"a": 1, "b": 2, "c": 3}, {"d": 4, "e": 5, "f": 6}, {"x": 24, "y": 25, "z": 26}]},
        {"arr2": [{"one": 1, "two": 2}, {"three": 3, "four": 4}, {"five": 5, "six": 6}]},
        {"arr3": [{"name": "Nippy", "age": 3}, {"name": "Bozzy", "age": 1}, {"name": "Dinky", "age": 7}]}
    ];
*/

//var givenObj = null;

var bird1 = {};
var bird2 = {};
bird1.species = "robin";
bird1.name = "Fred";
bird2.species = "robin";
bird2.name = "Wilma";

bird1.mate = bird2;
bird2.mate = bird1;

//var givenObj = bird1;
var givenObj = bird2;

//var givenObj = window;

//var allObjValues = extractObject(givenObj);
var showCircularStructures = true;
var allObjValues = extractObject(givenObj, showCircularStructures);

console.log(allObjValues);
