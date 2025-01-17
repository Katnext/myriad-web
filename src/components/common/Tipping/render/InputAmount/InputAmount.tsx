import React, {useEffect, useState} from 'react';

import {TextField} from '@material-ui/core';
import type {InputProps} from '@material-ui/core';

import {BN, BN_ZERO, isBn} from '@polkadot/util';

import {useStyles} from './InputAmount.style';

import {formatBalance} from 'src/helpers/balance';
import {toBigNumber} from 'src/helpers/string';
import {CurrencyId} from 'src/interfaces/currency';

type InputAmountProps = Omit<InputProps, 'onChange'> & {
  defaultValue?: string | BN;
  maxValue: BN | number;
  length?: number;
  fee?: BN;
  decimal: number;
  currencyId: CurrencyId;
  onChange?: (value: BN, valid: boolean) => void;
};

export const InputAmount: React.FC<InputAmountProps> = props => {
  const {defaultValue, maxValue, fee = BN_ZERO, decimal, length, currencyId, onChange} = props;

  const styles = useStyles();

  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState(true);
  const [error, setError] = useState<string>();
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setValid(true);
      setValue('');
      setError(undefined);
    };
  }, []);

  // reset the input amount when changing currency
  useEffect(() => {
    setValid(true);

    if (!defaultValue) return;

    if (typeof defaultValue === 'string' && parseInt(defaultValue) > 0) {
      setValue(defaultValue.toString());
    } else if (isBn(defaultValue) && defaultValue.gt(BN_ZERO)) {
      const formatted = formatBalance(defaultValue, decimal);

      setValue(formatted.toString());
    } else {
      setValue('');
    }
  }, [currencyId]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // remove invalid char and convert to dot formatted decimal
    const input = value.replace(/[^\d.,]+$/, '').replace(/,/, '.');

    const [amount, valid, errorMessage] = validateInput(input);

    setValue(input);
    setValid(valid);
    setError(errorMessage);
    setDirty(true);

    onChange && onChange(amount, valid);
  };

  const handleInputWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    target.blur();
  };

  const validateInput = (amount: string): [BN, boolean, string?] => {
    const value = toBigNumber(amount, decimal);
    const balance = isBn(maxValue) ? maxValue : toBigNumber(maxValue.toString(), decimal);
    const maxTip = balance.sub(fee);

    if (length && amount.length > length) {
      return [value, false, `${length} char maximum`];
    }

    if (value.lte(BN_ZERO)) {
      return [value, false, 'Digit only'];
    }

    if (maxTip && maxTip.lten(0)) {
      return [value, false, 'Insufficient balance'];
    }

    if (maxTip && maxTip.gtn(0) && value.gt(maxTip)) {
      return [value, false, 'Insufficient balance'];
    }

    return [value, true];
  };

  return (
    <>
      <TextField
        id="input-amount"
        classes={{root: styles.input}}
        label="Tip amount"
        type="number"
        variant="outlined"
        InputLabelProps={{shrink: dirty}}
        inputProps={{min: 0}}
        value={value}
        error={!valid}
        onChange={handleAmountChange}
        onWheel={handleInputWheel}
        helperText={error}
      />
    </>
  );
};
