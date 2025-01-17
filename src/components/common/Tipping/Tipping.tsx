import React, {useEffect, useState} from 'react';

import {Backdrop, CircularProgress} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {BN, BN_ZERO} from '@polkadot/util';

import {TermOfService} from '../TermOfService';
import {SendTipProps} from './Tipping.interface';
import {useStyles} from './Tipping.style';
import {TippingInfo} from './render/Info';
import {InputAmount} from './render/InputAmount';
import {Summary} from './render/Summary';
import {TIPPING_STORAGE_KEY} from './render/Tipping.success';

import localforage from 'localforage';
import {Button, ButtonVariant} from 'src/components/atoms/Button';
import {CurrencyOptionComponent} from 'src/components/atoms/CurrencyOption';
import {ListItemComponent} from 'src/components/atoms/ListItem';
import {formatBalance} from 'src/helpers/balance';
import {toBigNumber} from 'src/helpers/string';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import {WalletType} from 'src/interfaces/wallet';

const INITIAL_AMOUNT = new BN(-1);

export const Tipping: React.FC<SendTipProps> = props => {
  const {
    sender,
    receiver,
    reference,
    referenceType,
    balances,
    defaultCurrency,
    currentNetwork,
    onSuccess,
  } = props;

  const classes = useStyles();
  const {isSignerLoading, simplerSendTip, getEstimatedFee} = usePolkadotApi();
  const {getEstimatedFee: getEstimatedFeeNear, sendAmount} = useNearApi();

  const [amount, setAmount] = useState<BN>(INITIAL_AMOUNT);
  const [transactionFee, setTransactionFee] = useState<BN>(INITIAL_AMOUNT);
  const [currency, setCurrency] = useState<BalanceDetail>(defaultCurrency);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [disableExternalCurrency, setDisableExternalCurrency] = useState(false);
  const [loadingFee, setLoadingFee] = useState(true);
  const [tippingAmountValid, setTippingAmountValid] = useState(false);

  useEffect(() => {
    // disable other currencies when tipping to unclaimed imported posts
    if (
      referenceType === 'post' &&
      'people' in reference &&
      reference.people &&
      !('userSocialMedia' in reference.people)
    ) {
      const enabledCurrency = balances.find(balance => balance.symbol === CurrencyId.MYRIA);

      if (enabledCurrency) {
        setCurrency(enabledCurrency);
        calculateTransactionFee(enabledCurrency);
      }

      setDisableExternalCurrency(true);
    } else {
      calculateTransactionFee(defaultCurrency);
    }
  }, []);

  const getAddressByUser = (user: User) => {
    if (!user.wallets.length) {
      return null;
    }

    const wallet = user.wallets.find(ar => ar.networkId === currentNetwork);

    return wallet?.id ?? null;
  };

  const handleChangeAgreement = (accepted: boolean) => {
    setAgreementChecked(accepted);
  };

  const calculateTransactionFee = async (selected: BalanceDetail) => {
    const senderAddress = getAddressByUser(sender);

    if (!receiver.walletDetail || !senderAddress) return;

    setLoadingFee(true);
    let fee: BN = BN_ZERO;
    //TODO: move to switch case
    if (currency.network.walletType === WalletType.POLKADOT) {
      const gasPrice = await getEstimatedFee(senderAddress, receiver.walletDetail, selected);
      if (gasPrice) {
        fee = gasPrice;
      }
    }

    if (currency.network.walletType === WalletType.NEAR) {
      const {gasPrice} = await getEstimatedFeeNear();
      if (gasPrice) {
        fee = toBigNumber(gasPrice, currency.decimal);
      }
    }

    setLoadingFee(false);
    setTransactionFee(fee);
  };

  const handleChangeCurrency = async (selected: BalanceDetail) => {
    if (selected.id === currency.id) return;

    // reset tipping data
    setCurrency(selected);
    setAmount(INITIAL_AMOUNT);
    setTransactionFee(INITIAL_AMOUNT);

    calculateTransactionFee(selected);
  };

  const handleAmountChange = (amount: BN, valid: boolean) => {
    if (amount.gt(BN_ZERO) && valid) {
      setAmount(amount);
    } else {
      setAmount(INITIAL_AMOUNT);
    }

    setTippingAmountValid(valid);
  };

  const signTransaction = async () => {
    if (amount.lte(BN_ZERO)) return;

    const senderAddress = getAddressByUser(sender);

    if (!receiver.walletDetail || !senderAddress) return;
    if (currency.native) receiver.walletDetail.ftIdentifier = 'native';
    else receiver.walletDetail.ftIdentifier = currency.referenceId;

    const attributes = {
      from: senderAddress,
      to: receiver.id,
      amount,
      currency,
      walletDetail: receiver.walletDetail,
    };

    // not direct tipping
    if ([ReferenceType.POST, ReferenceType.COMMENT].includes(referenceType)) {
      Object.assign(attributes, {
        type: referenceType,
        referenceId: reference.id,
      });
    }

    const storageAttribute = {
      attributes,
      receiver,
      reference,
      referenceType,
      amount: formatBalance(amount, currency.decimal),
    };
    await localforage.setItem(TIPPING_STORAGE_KEY, storageAttribute);
    if (currency.network.walletType === WalletType.POLKADOT) {
      simplerSendTip(attributes, hash => {
        onSuccess(currency, hash, attributes.amount);

        setAmount(INITIAL_AMOUNT);
        setTransactionFee(INITIAL_AMOUNT);
      });
    }

    if (currency.network.walletType === WalletType.NEAR) {
      sendAmount(receiver.walletDetail.referenceId, amount, currency.referenceId);
    }
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.subHeaderSection}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography className={classes.subHeader}>Balance</Typography>
          </Grid>
          <Grid item>
            <TippingInfo />
          </Grid>
        </Grid>

        <ListItemComponent
          avatar={currency.image}
          title={currency.symbol}
          subtitle={currency.freeBalance === 0 ? '0' : parseFloat(currency.freeBalance.toFixed(4))}
          action={
            <CurrencyOptionComponent
              onSelect={handleChangeCurrency}
              balanceDetails={balances}
              isOtherTippingCurrencyDisabled={disableExternalCurrency}
            />
          }
        />
        <form className={classes.formRoot} autoComplete="off">
          <InputAmount
            defaultValue={amount}
            placeholder="Tip Amount"
            decimal={currency.decimal}
            fee={transactionFee}
            maxValue={currency.freeBalance}
            length={10}
            currencyId={currency.symbol}
            onChange={handleAmountChange}
          />

          <Summary
            amount={amount}
            transactionFee={transactionFee}
            receiver={receiver}
            currency={currency}
            loadingFee={loadingFee}
          />

          <div className={classes.formControls}>
            <TermOfService about="Tipping" onChange={handleChangeAgreement} />

            <Button
              isDisabled={
                !agreementChecked || amount.lte(BN_ZERO) || loadingFee || !tippingAmountValid
              }
              variant={ButtonVariant.CONTAINED}
              onClick={signTransaction}>
              Send my tips
            </Button>
          </div>
        </form>
      </div>

      <Backdrop className={classes.backdrop} open={isSignerLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Paper>
  );
};

export default Tipping;
