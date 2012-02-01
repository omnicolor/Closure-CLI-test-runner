/**
 * @fileoverview Unit tests for foo script.
 */


function testFooTwoPositive() {
    assertEquals(3, add(1, 2));
}

function testFooTwoNegative() {
    assertEquals(-3, add(-1, -2));
}

function testFooStrings() {
    assertEquals('a5', add('a', 5));
}
