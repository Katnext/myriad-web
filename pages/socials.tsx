import React from 'react';
import {useSelector} from 'react-redux';

import {getSession} from 'next-auth/client';
import getConfig from 'next/config';
import Head from 'next/head';

import {SocialsContainer} from 'src/components/Socials/Socials.container';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {setHeaders} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

const Socials: React.FC = () => {
  const {socials} = useSelector<RootState, UserState>(state => state.userState);

  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>{i18n.t('SocialMedia.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <TopNavbarComponent
        description={`${socials.length} account connected`}
        sectionTitle={SectionTitle.SOCIAL_MEDIA}
        type={'menu'}
      />

      <SocialsContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;

  const dispatch = store.dispatch as ThunkDispatchAction;

  const available = await healthcheck();

  if (!available) {
    return {
      redirect: {
        destination: '/maintenance',
        permanent: false,
      },
    };
  }

  const session = await getSession(context);

  setHeaders({cookie: req.headers.cookie as string});

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;

  if (anonymous || !userId) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(getUserCurrencies()),
      dispatch(fetchUserWallets()),
      dispatch(fetchNetwork()),
    ]);
  }

  await dispatch(fetchExchangeRates());
  await dispatch(fetchUserExperience());

  return {
    props: {
      session,
    },
  };
});

export default Socials;
