const ConnectChainToken = artifacts.require('ConnectChainToken');

contract('ConnectChainToken', function ([owner, official, newOwner, newOfficial, holder1, holder2]) {
  beforeEach(async function () {
      this.cctn = await ConnectChainToken.new(official);
  });

  it('check-basic-info', async function() {
    assert.equal(await this.cctn.name(), "Connect Chain token");
    assert.equal(await this.cctn.symbol(), "CCTN");
    assert.equal(await this.cctn.decimals(), 18);
    assert.equal(await this.cctn.totalSupply(), "300000000000000000000000000");
    assert.equal(await this.cctn.ownerAddress(), owner);
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(owner), 0);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
  });

  it('check-transfer-ownership', async function() {
    assert.equal(await this.cctn.ownerAddress(), owner);
    await this.cctn.transferOwnership(newOwner);
    assert.equal(await this.cctn.ownerAddress(), newOwner);
  });

  it('check-transfer-official-zero', async function() {
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(newOfficial), 0);
    await this.cctn.transferOfficial(newOfficial);
    assert.equal(await this.cctn.officialAddress(), newOfficial);
    assert.equal(await this.cctn.balanceOf(official), 0);
    assert.equal(await this.cctn.balanceOf(newOfficial), "300000000000000000000000000");
  });

  it('check-transfer-official-nozero', async function() {
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(newOfficial), 0);
    await this.cctn.transfer(newOfficial, "100000000000000000000000000", {from: official});
    assert.equal(await this.cctn.balanceOf(official), "200000000000000000000000000");
    await this.cctn.transferOfficial(newOfficial);
    assert.equal(await this.cctn.officialAddress(), newOfficial);
    assert.equal(await this.cctn.balanceOf(official), 0);
    assert.equal(await this.cctn.balanceOf(newOfficial), "300000000000000000000000000");
  });

  it('check-transfer-from-official', async function() {
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), 0);
    await this.cctn.transfer(holder1, "1000", {from: official});
    assert.equal(await this.cctn.balanceOf(official), "299999999999999999999999000");
    assert.equal(await this.cctn.balanceOf(holder1), "1000");
  });

  it('check-transfer-from-overflow', async function() {
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), 0);
    try {
      await this.cctn.transfer(holder1, "300000000000000000000000001", {from: official});
      assert.fail();
    } catch(_) {
    }
  });

  it('check-transfer', async function() {
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), 0);
    assert.equal(await this.cctn.balanceOf(holder2), 0);
    await this.cctn.transfer(holder1, "100000000000000000000000000", {from: official});
    assert.equal(await this.cctn.balanceOf(official), "200000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), "100000000000000000000000000");
    await this.cctn.transfer(holder2, "1000", {from: holder1});
    assert.equal(await this.cctn.balanceOf(official), "200000000000000000000000001");
    assert.equal(await this.cctn.balanceOf(holder1), "99999999999999999999999000");
    assert.equal(await this.cctn.balanceOf(holder2), "999");
  });

  it('check-transfer-capfee', async function() {
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), 0);
    assert.equal(await this.cctn.balanceOf(holder2), 0);
    await this.cctn.transfer(holder1, "100000000000000000000000000", {from: official});
    assert.equal(await this.cctn.balanceOf(official), "200000000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), "100000000000000000000000000");
    await this.cctn.transfer(holder2, "100000000000000000000000000", {from: holder1});
    assert.equal(await this.cctn.balanceOf(official), "200001000000000000000000000");
    assert.equal(await this.cctn.balanceOf(holder1), "0");
    assert.equal(await this.cctn.balanceOf(holder2), "99999000000000000000000000");
  });

  it('check-transfer-burn', async function() {
    assert.equal(await this.cctn.officialAddress(), official);
    assert.equal(await this.cctn.balanceOf(official), "300000000000000000000000000");
    await this.cctn.burn("100000000000000000000000000", {from: official});
    assert.equal(await this.cctn.balanceOf(official), "200000000000000000000000000");
    assert.equal(await this.cctn.totalSupply(), "200000000000000000000000000");
  });
});