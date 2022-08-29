import { parseUnits } from 'ethers/lib/utils'
const { BigNumber } = require('ethers')

export enum TOKEN_DECIMAL {
  MYTOKEN = 18,
  DEFAULT = ''
}

export enum TOKEN_NAME {
  MYTOKEN = 'MYTOKEN',
  DEFAULT = ''
}

// Defaults to e18 using amount * 10^18
export function getBigNumber(amount:number | string, decimals = 18) {
  return parseUnits(amount.toString(), decimals);
}
