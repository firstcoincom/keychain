const eth = require('../lib/eth');
const assert = require('assert');
const chai = require('chai');

describe('createWallet', () => {
  it('should handle undefined entropy', () => {
    chai.expect(
      () => eth.createWallet()
    ).to.throw('entropy cannot be undefined or empty');
  });


  it('should handle undefined numShares or threshold', () => {
    chai.expect(
      () => eth.createWallet('test')
    ).to.throw('numShares or threshold invalid');
  });

  it('should handle undefined threshold', () => {
    chai.expect(
      () => eth.createWallet('test', 1)
    ).to.throw('numShares or threshold invali');
  });

  it('should handle null threshold', () => {
    chai.expect(
      () => eth.createWallet('test', 1, null)
    ).to.throw('numShares or threshold invalid');
  });

  it('should handle undefined numShares', () => {
    chai.expect(
      () => eth.createWallet('test', undefined, 1)
    ).to.throw('numShares or threshold invalid');
  });

  it('should handle null numShares', () => {
    chai.expect(
      () => eth.createWallet('test', null, 1)
    ).to.throw('numShares or threshold invalid');
  });

  it('should handle 0 numShares', () => {
    chai.expect(
      () => eth.createWallet('test', 0, 5)
    ).to.throw('numShares or threshold invalid');
  });

  it('should handle negative numShares', () => {
    chai.expect(
      () => eth.createWallet('test', -1, 5)
    ).to.throw('numShares and threshold cannot be negative');
  });

  it('should handle 0 threshold', () => {
    chai.expect(
      () => eth.createWallet('test', 5, 0)
    ).to.throw('numShares or threshold invalid');
  });

  it('should handle negative threshold', () => {
    chai.expect(
      () => eth.createWallet('test', 5, -1)
    ).to.throw('numShares and threshold cannot be negative');
  });

  it('should handle numShares < threshold', () => {
    chai.expect(
      () => eth.createWallet('test', 3, 5)
    ).to.throw('numShares cannot be less than threshold');
  });

  it('should generate valid shares for valid input', () => {
    const shares = eth.createWallet('test', 5, 3);
    assert.equal(
      shares.shares.length,
      5,
      'it should generated correct number of shares'
    );
    assert.ok(shares.address);
  })
});

describe('verifyShares', () => {
  it('should handle invalid input for shares', () => {
    chai.expect(
      () => eth.verifyShares('test', 'test')
    ).to.throw('invalid value passed for shares')
  });

  it('should handle 0 shares', () => {
    chai.expect(
      () => eth.verifyShares([], 'test')
    ).to.throw('invalid value passed for shares')
  });

  it('should handle invalid input for address', () => {
    chai.expect(
      () => eth.verifyShares(['123'], 1)
    ).to.throw('invalid value passed for address')
  });

  it('should return true for valid inputs', () => {
    const shares = eth.createWallet('test', 5, 3);
    assert.strictEqual(
      eth.verifyShares(shares.shares.slice(1,4), shares.address),
      true,
      'should validate the address correctly'
    );
  });

  it('should return false for invalid shares', () => {
    const shares = eth.createWallet('test', 5, 3);
    assert.strictEqual(
      eth.verifyShares([shares.shares[0], shares.shares[0], shares.shares[0]], shares.address),
      false,
      'should validate the address correctly'
    );
  });

  it('should return false for invalid address', () => {
    const shares = eth.createWallet('test', 5, 3);
    assert.strictEqual(
      eth.verifyShares(eth.createWallet('test', 5, 3).shares.slice(1,4), shares.address),
      false,
      'should validate the address correctly'
    );
  });
})
