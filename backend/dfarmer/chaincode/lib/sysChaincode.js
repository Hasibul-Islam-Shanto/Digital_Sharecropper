/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class SysChanicode extends Contract {
  //*============= Create Account =============
  async CreateAccount(ctx, key, txId, name, phoneNo, nid, userType, password) {
    // ctx is transaction context
    const user = {
      Key: key,
      TxnId: txId,
      Name: name,
      PhoneNo: phoneNo,
      Nid: nid,
      Type: userType,
      Password: password,
      DocType: 'user',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(user)))
    );
    return JSON.stringify(user);
  }

  //*================ Create Admin ===================
  async CreateAdmin(ctx, key, email, password) {
    // ctx is transaction context
    const user = {
      Key: key,
      Name: 'Central Author',
      Email: email,
      Password: password,
      Type: 'admin',
      DocType: 'admin',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(user)))
    );
    return JSON.stringify(user);
  }

  //*================ Create Agent ===================
  async CreateAgent(ctx, key, name, email, location, password) {
    // ctx is transaction context
    const user = {
      Key: key,
      Name: name,
      Email: email,
      Location: location,
      Password: password,
      Type: 'agent',
      DocType: 'agent',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(user)))
    );
    return JSON.stringify(user);
  }

  //*================ Get user ==============
  async FindUser(ctx, key, phoneNo, password) {
    const userJSON = await ctx.stub.getState(key); // get the asset from chaincode state
    if (!userJSON || userJSON.length === 0) {
      throw new Error(`The user for user id does not exist`);
    }

    const user = JSON.parse(userJSON.toString());
    // if (user.PhoneNo !== phoneNo) {
    //   throw new Error('user phone-no and password do not matched!');
    // }
    if (user.Password !== password) {
      throw new Error('user phone-no and password do not matched!');
    }

    return userJSON.toString();
  }

  //*=========== get user by id ==============
  async GetUser(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'user';
    queryString.selector.Key = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*=========== get user by nid ==============
  async GetUserByNid(ctx, nid) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'user';
    queryString.selector.Nid = nid;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*============= Farmer Request for land =============

  async RequestLand(
    ctx,
    key,
    userId,
    txId,
    name,
    nid,
    landLocation,
    harvestType,
    landAmount,
    reqTime,
    expTime,
    status
  ) {
    // ctx is transaction context
    const requestLand = {
      Key: key,
      FarmerId: userId,
      TxnId: txId,
      Name: name,
      Nid: nid,
      LandLocation: landLocation,
      LandAmount: landAmount,
      HarvestType: harvestType,
      ExpTime: expTime,
      ReqTime: reqTime,
      Status: status,
      DocType: 'landreq',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(requestLand)))
    );
    return JSON.stringify(requestLand);
  }

  //*=============== Farmer get their requests ==================
  async GetAppointment(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'landreq';
    queryString.selector.FarmerId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*============== Agent set appointment for farmer to meet ================
  async SetAppointment(
    ctx,
    key,
    txId,
    userId,
    agentId,
    appointmentTime,
    place
  ) {
    // ctx is transaction context
    const setAppointment = {
      Key: key,
      TxnId: txId,
      UserId: userId,
      AgentId: agentId,
      AppointmentTime: appointmentTime,
      Place: place,
      DocType: 'appointment',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(setAppointment)))
    );
    return JSON.stringify(setAppointment);
  }

  //*=============== Farmer get appointment from the agent ==================
  async GetAppointmentFromAgent(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'appointment';
    queryString.selector.UserId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*==================== Landowner submit form for lending land ==================
  async RequestLendLand(
    ctx,
    key,
    txId,
    userId,
    nid,
    landId,
    landLocation,
    landAmount,
    reqTime,
    status
  ) {
    // ctx is transaction context
    const requestLendLand = {
      Key: key,
      TxnId: txId,
      LandOwnerId: userId,
      Nid: nid,
      LandId: landId,
      LandLocation: landLocation,
      LandAmount: landAmount,
      ReqTime: reqTime,
      Status: status,
      DocType: 'lendLand',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(requestLendLand)))
    );
    return JSON.stringify(requestLendLand);
  }

  //*=============== Landowner get their requests ==================
  async GetRequestByLandOwner(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'lendLand';
    queryString.selector.LandOwnerId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*=============== Farmer get their requests ==================
  async GetRequestByFarmer(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'landreq';
    queryString.selector.FarmerId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*=================== agent get farmer req by location ==================
  async GetFarmerReqByLocation(ctx, location) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'landreq';
    queryString.selector.LandLocation = location;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*=================== agent get farmer req by Nid ==================
  async GetFarmerReqByNid(ctx, nid) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'landreq';
    queryString.selector.Nid = nid;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*=================== agent get landowner req by location ==================
  async GetLandOwnerReqByLocation(ctx, location) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'lendLand';
    queryString.selector.LandLocation = location;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*=================== agent get landowner req by location ==================
  async GetLandOwnerReqByNid(ctx, nid) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'lendLand';
    queryString.selector.Nid = nid;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*======================== Agent submit a deal request to the admin ======================
  async RequestDeal(
    ctx,
    key,
    txId,
    agentId,
    landOwnerNid,
    farmerNid,
    landId,
    landAmount,
    reqTime,
    status
  ) {
    // ctx is transaction context
    const deal = {
      Key: key,
      TxnId: txId,
      AgentId: agentId,
      LandOwnerNid: landOwnerNid,
      FarmerNid: farmerNid,
      LandId: landId,
      LandAmount: landAmount,
      ReqTime: reqTime,
      Status: status,
      DocType: 'req-deal',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(deal)))
    );
    return JSON.stringify(deal);
  }

  //*================= Get all Deal request by admin ======================
  async GetAllDealRequest(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'req-deal';
    // queryString.selector.JailId = jailId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*==================== Get request deal data by land id =============
  async GetDealReqByLandId(ctx, landId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'req-deal';
    queryString.selector.LandId = landId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*==================== Make a deal or contract by admin ==================
  async CreatDeal(
    ctx,
    key,
    txId,
    agentId,
    landOwnerNid,
    farmerNid,
    landId,
    landAmount,
    status
  ) {
    // ctx is transaction context
    const deal = {
      Key: key,
      TxId: txId,
      AgentId: agentId,
      LandOwnerNid: landOwnerNid,
      FarmerNid: farmerNid,
      LandId: landId,
      LandAmount: landAmount,
      Status: status,
      DocType: 'deal',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(deal)))
    );
    return JSON.stringify(deal);
  }

  //*================ Get deal info by landowner ==================
  async GetDealByLandOwner(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'deal';
    queryString.selector.LandOwnerId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*================ Get deal info by location ==================
  async GetDealByLocation(ctx, location) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'deal';
    queryString.selector.LandLocation = location;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*================ Get deal info by farmer ==================
  async GetDealByFarmer(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'deal';
    queryString.selector.FarmerId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*================= Get Deal by land location by admin =====================
  async GetDealByLocation(ctx, location) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'deal';
    queryString.selector.LandLocation = location;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*==================== Request Invest by investor to the company ==================
  async RequestInvest(
    ctx,
    key,
    txId,
    investorId,
    investorName,
    investorNid,
    investAmount,
    transactionId,
    time
  ) {
    // ctx is transaction context
    const invest = {
      Key: key,
      TxnId: txId,
      InvestorId: investorId,
      InvestorName: investorName,
      InvestorNid: investorNid,
      InvestAmount: investAmount,
      Time: time,
      DocType: 'investreq',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(invest)))
    );
    return JSON.stringify(invest);
  }

  //*================= Get investment info by investor id ===================
  async GetInvestment(ctx, userId) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'investreq';
    queryString.selector.InvestorId = userId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*================= Get all invest by admin ======================
  async GetAllInvestment(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'investreq';
    // queryString.selector.JailId = jailId;
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*================= Set count ===================
  async SetCount(ctx, key, court, jail, passport, police, criminal) {
    // ctx is transaction context
    const Count = {
      Key: key,
      Court: court,
      Jail: jail,
      Passport: passport,
      Police: police,
      Criminal: criminal,
      DocType: 'count',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(Count)))
    );
    return JSON.stringify(Count);
  }

  //*=============== Get Count =======================
  async GetCount(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'count';
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  //*================= Create Transaction ==============
  async CreateTxn(ctx, key, txId, date, time, type, name) {
    // ctx is transaction context
    const data = {
      Key: key,
      TxId: txId,
      Date: date,
      Time: time,
      Type: type,
      Name: name,
      DocType: 'txn',
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      // The stub encapsulates the APIs between the chaincode implementation and the Fabric peer.
      key,
      Buffer.from(stringify(sortKeysRecursive(data)))
    );
    return JSON.stringify(data);
  }

  //*=============== Get Txn =======================
  async GetTxn(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.DocType = 'txn';
    let resultsIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let results = await this.GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  async GetAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.txId;
          jsonRes.Timestamp = res.value.timestamp;
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }
}

module.exports = SysChanicode;
