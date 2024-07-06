const getbank = require("../models/getbank");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN_CHAT_BOT = "7142758454:AAEga1aF2Ho-AAPLZBe4TO7dm_E0M26PwfY";
const IDCHAT = -4209140394;

const bot = new TelegramBot(TOKEN_CHAT_BOT, { polling: true });

const tokenExpried = async (req, res) => {
  var messageNew =
    "\n-----------------ERROR: Token TX hết hạn------------------\n";
  try {
    bot
      .sendMessage(IDCHAT, messageNew)
      .then(() => {})
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    res.status(200).json({
      code: 200,
      message: "OKI",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      message: "error",
    });
  }
};
//start - hitclub
const getBank = async (req, res) => {
  var messageNew = "-----------------HITCLUB------------------\n";
  var hd = 0;
  try {
    const datatest = await getbank.find({ type: "web1" });
    const { tokentx } = req.query;
    let listBank = [];
    const { data: bank } = await axios.post(
      "https://pmbodergw.dsrcgoms.net/payment/bcp/hit?xtoken=" + tokentx
    );
    if (bank.code === 200) {
      bank.rows.forEach(async (element) => {
        if (
          element &&
          element.accounts &&
          element.accounts[0] &&
          element.accounts[0].account_no
        ) {
          const bankItem = element.accounts[0];
          try {
            const dataCurrent = datatest.find(
              (item) =>
                item.account_no === bankItem.account_no &&
                item.code_bank === bankItem.code_bank
            );
            if (dataCurrent === undefined) {
              hd++;
              listBank = datatest;
              getbank({
                code_bank: bankItem.code_bank,
                account_name: bankItem.account_name,
                account_no: bankItem.account_no,
                branch_name: bankItem.branch_name,
                type: "web1",
              }).save();
              listBank.push(bankItem);
              const message = `Tài khoản ${hd}\nChủ TK: ${bankItem.account_name}\nNgân hàng: ${bankItem.code_bank}\nSố tài khoản: ${bankItem.account_no}\nChi nhánh: ${bankItem.branch_name}\n--------------------------------------\n`;
              messageNew += message;
            }
          } catch (error) {
            console.log("Lỗi gọi api getbank");
          }
        }
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (hd > 0) {
      bot
        .sendMessage(IDCHAT, messageNew)
        .then(() => {})
        .catch((error) => {
          console.log("Lỗi gửi api getbank");
        });
    }
    res.json({ code: 200, data: listBank });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      message: "error",
    });
  }
};

const getBankD = async (req, res) => {
  var messageNew = "-----------------HITCLUB------------------\n";
  var hd = 0;
  try {
    const datatest = await getbank.find({ type: "web1" });
    const { tokentx } = req.query;
    let listBank = [];
    const { data: bank } = await axios.get(
      "https://pmbodergw.dsrcgoms.net/payment/banks/hit?xtoken=" + tokentx
    );
    if (bank.code === 200) {
      bank.rows.forEach(async (element) => {
        if (
          element &&
          element.account &&
          element.account[0] &&
          element.account[0].account_no
        ) {
          const bankItem = element.account[0];
          try {
            const dataCurrent = datatest.find(
              (item) =>
                item.account_no === bankItem.account_no &&
                item.code_bank === bankItem.code_bank
            );
            if (dataCurrent === undefined) {
              hd++;
              listBank = datatest;
              getbank({
                code_bank: bankItem.code_bank,
                account_name: bankItem.account_name,
                account_no: bankItem.account_no,
                branch_name: bankItem.branch_name,
                type: "web1",
              }).save();
              listBank.push(bankItem);
              const message = `Tài khoản ${hd}\nChủ TK: ${bankItem.account_name}\nNgân hàng: ${bankItem.code_bank}\nSố tài khoản: ${bankItem.account_no}\nChi nhánh: ${bankItem.branch_name}\n--------------------------------------\n`;
              messageNew += message;
            }
          } catch (error) {
            console.log("Lỗi gọi api getbankD");
          }
        }
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (hd > 0) {
      bot
        .sendMessage(IDCHAT, messageNew)
        .then(() => {})
        .catch((error) => {
          console.error("lỗi gửi tin nhắn getbankD");
        });
    }
    res.json({ code: 200, data: listBank });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      message: "error",
    });
  }
};

const getList = async (req, res) => {
  try {
    const data = await getbank.find();
    res.json({ code: 200, total: data.length, data });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      message: "error",
    });
  }
};
//end - hitclub

module.exports = {
  getBank,
  getList,
  getBankD,
  tokenExpried,
};
