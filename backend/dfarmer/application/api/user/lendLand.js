const getUserApi = require('./getUser.js');
const getDate = require('../../utils/getDate.js');

module.exports = {
  lendLand: async (req, res, contract, txId, createTxn) => {
    // API implementation
    const { userId, landId, landLocation, landAmount } = req.body;
    // key would be fetch from cookie of browser
    const data = await getUserApi.getUser(userId, contract);
    const user = JSON.parse(data);
    const nid = user[0].Record.Nid;
    const currDate = getDate.date();
    const status = 'pending';

    const key = `lendLand_${userId}_${landId}`;
    try {
      let result = await contract.evaluateTransaction(
        'RequestLendLand',
        key,
        txId,
        userId,
        nid,
        landId,
        landLocation,
        landAmount,
        currDate,
        status
      );
      await contract.submitTransaction(
        'RequestLendLand',
        key,
        txId,
        userId,
        nid,
        landId,
        landLocation,
        landAmount,
        currDate,
        status
      );
      console.log(
        `Request lend land for user - ${userId} is successful.\n Result: ${result}\n`
      );
      createTxn(txId, `Request Lend land by ${key}`, landLocation);
      res.send(result);
    } catch (error) {
      console.log(`*** Successfully caught the error: \n    ${error}\n`);
      res.send('failed');
    }
  },
};
