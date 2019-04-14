// I implemented my own queue because apparently its not built into js
class Node {
    constructor(element) {
        this.element = element;
        this.next = null
        this.prev = null
    }
}


class Queue {
    constructor(){
        this.head = null;
        this.tail = null
        this.size = 0;
    }

    push(item) {
        this.size++;
        var node = new Node(item)
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail
            this.tail = node;
        }
    }

    pop() {
        this.size--
        if (this.head == null){
            return null
        } else{
            var node = this.head
            this.head = this.head.next
            return node.element
        }
    }

    count() {
        return this.size
    }

    isEmpty () {
        return this.size === 0;
    }
}


module.exports = Queue;