import React from 'react';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';
import dynamic from 'umi/dynamic';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
// export default props => {
//   const { location } = props;
//   const { pathname } = location;
//   if (/\/user/i.test(pathname)) {
//     return <UserLayout {...props} />;
//   }
//   return <BasicLayout {...props} />;
// };

function mapStateToProps({ login }) {
  return {
    isLogin: login.isLogin,
  };
}

const app = () =>
  withRouter(props => {
    const { location } = props;
    const { pathname } = location;
    // if (/\/user/i.test(pathname)) {
    //   return <UserLayout {...props} />;
    // }
    return <BasicLayout {...props} />;
  });

// const app = () =>
// withRouter(
//   connect(mapStateToProps)(({ props, isLogin }) => {
//     console.log(isLogin+"=========")
//        const { location } = props;
//        const { pathname } = location;
//   //  if (/\/user/i.test(pathname)) {
//   //     return <UserLayout {...props} />;
//   //   }
//     return <BasicLayout {...props} />;
//   })
// );

export default dynamic({
  loader: async () => {
    return app();
  },
});
