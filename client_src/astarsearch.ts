import creature = require('./creature');
import game = require('./game');
import map = require('./map');

export function findPathToPosition(currentPosition: map.TileView, goal: map.TileView) {
    //console.log(goal);
    var explored = [];
    var path: map.TileView[] = [];
    var q: PriorityQueue = new PriorityQueue;
    q.add(new Node(currentPosition, 0, goal));
    while (!(q.peek().value == 0)) {
        var n: Node = q.dequeue();
        explored.push(n.space.getTile());
        var children: Node[] = [];
        var r: number = n.space.getY();
        var c: number = n.space.getX();
        children.push(new Node(n.space.viewNorth(), n.g + 1, goal));
        children.push(new Node(n.space.viewEast(), n.g + 1, goal));
        children.push(new Node(n.space.viewSouth(), n.g + 1, goal));
        children.push(new Node(n.space.viewWest(), n.g + 1, goal));
        while (children.length > 0) {
            if (!children[0].space.isTraversable() || explored.indexOf(children[0].space.getTile()) != -1)
                children.shift();
            else {
                children[0].setParent(n);
                q.add(children.shift());
            }
        }
    }
    var pathstack: map.TileView[];
    pathstack = [];
    var n: Node;
    n = q.dequeue();
    do {
        pathstack.push(n.space);
        n = n.parent;
    }   while (n != null);
    do {
        path.unshift(pathstack.pop());
    } while (pathstack.length > 0);
    //console.log(path);
    return path;
}


class Node {
    parent: Node;
    value: number;
    g: number;
    space: map.TileView;

    constructor(s: map.TileView, gx: number, goal: map.TileView) {
    this.value = Math.abs(s.getY() - goal.getY())
        + Math.abs(s.getX() - goal.getX());
    this.space = s;
    this.g = gx;
    this.parent = null;
    }

    public setParent(p: Node): void {
        this.parent = p;
    }

    public compare(n: Node): number {
        var fx: number;
        fx = this.value + this.g - n.value - n.g;
        if (fx != 0)
            return fx;
        else {
            var l1_order: number;
            l1_order = this.value - n.value;
            if (l1_order != 0)
                return l1_order;
            else {
                var row_order;
                row_order = this.space.getY() - n.space.getY();
                if (row_order != 0)
                    return row_order;
                else
                    return this.space.getX() - n.space.getX();
            }
        }
    }
}

/*
 * This code was adapted from code available in the Typescript Collections project on Github.
 * Copyright 2013 Basarat Ali Syed. All Rights Reserved.
 * Licensed under MIT open source license http://opensource.org/licenses/MIT
 * Original javascript code was by Mauricio Santos
 */
class PriorityQueue {
    private data: Node[] = [];
    constructor () {}
    private leftChildIndex(nodeIndex: number): number {
        return (2 * nodeIndex) + 1;
    }
    private rightChildIndex(nodeIndex: number): number {
        return (2 * nodeIndex) + 2;
    }
    private parentIndex(nodeIndex: number): number {
        return Math.floor((nodeIndex - 1) / 2);
    }
    private minIndex(leftChild: number, rightChild: number): number {
        if (rightChild >= this.data.length) {
            if (leftChild >= this.data.length) {
                return -1;
            } else {
                return leftChild;
            }
        } else {
            if (this.data[leftChild].compare(this.data[rightChild]) <= 0) {
                return leftChild;
            } else {
                return rightChild;
            }
        }
    }
    private siftUp(index: number): void {
        var parent = this.parentIndex(index);
        while (index > 0 && this.data[parent].compare(this.data[index]) > 0) {
            var temp = this.data[parent];
            this.data[parent] = this.data[index];
            this.data[index] = temp;
            index = parent;
            parent = this.parentIndex(index);
        }
    }
    private siftDown(nodeIndex: number): void {
        //smaller child index
        var min = this.minIndex(this.leftChildIndex(nodeIndex),
            this.rightChildIndex(nodeIndex));

        while (min >= 0 && this.data[nodeIndex].compare(this.data[min]) > 0) {
            var temp = this.data[min];
            this.data[min] = this.data[nodeIndex];
            this.data[nodeIndex] = temp;
            nodeIndex = min;
            min = this.minIndex(this.leftChildIndex(nodeIndex),
                this.rightChildIndex(nodeIndex));
        }
    }
    peek(): Node {
        if (this.data.length > 0) {
            return this.data[0];
        } else {
            return undefined;
        }
    }
    add(element: Node): boolean {
        this.data.push(element);
        this.siftUp(this.data.length - 1);
        return true;
    }
    dequeue(): Node {
        if (this.data.length > 0) {
            var obj = this.data[0];
            this.data[0] = this.data[this.data.length - 1];
            this.data.splice(this.data.length - 1, 1);
            if (this.data.length > 0) {
                this.siftDown(0);
            }
            return obj;
        }
        return undefined;
    }
    isEmpty(): boolean {
        return this.data.length <= 0;
    }
}