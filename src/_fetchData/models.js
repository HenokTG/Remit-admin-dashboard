import { axiosInstance } from '../axios';

export const fetchPackages = (setLoading, setPACKAGELIST) => {
  axiosInstance
    .get(`api/remit/admin/packages`)
    .then((res) => {
      const PACKAGELIST = res.data
        .filter((mobPack) => mobPack.id !== 0)
        .map((mobilePackage) => ({
          id: mobilePackage.id,
          order: mobilePackage.package_order,
          value: mobilePackage.airtime_value,
          ETB: mobilePackage.selling_price_ETB,
          forexRate: mobilePackage.forex_rate,
          USD: mobilePackage.selling_price_USD,
          packageDisc: mobilePackage.discount_rate * 100,
        }));
      setLoading(false);
      setPACKAGELIST(PACKAGELIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setPACKAGELIST([]);
    });
};

export const fetchPromos = (setLoading, setPROMOLIST) => {
  axiosInstance
    .get(`api/remit/admin/promo-codes`)
    .then((res) => {
      const PROMOLIST = res.data
        .filter((proCd) => proCd.id !== 0)
        .map((promo) => ({
          id: promo.id,
          promter: promo.promoter,
          code: promo.promo_code,
          get date() {
            const dbDate = new Date(promo.promo_expiry_date).toString();
            return dbDate.split('G')[0];
          },
          rate: promo.promo_discount_rate * 100,
          get isExpired() {
            const dateRemain = new Date(promo.promo_expiry_date) - new Date();

            return dateRemain <= 0 && true;
          },
          get remainingDays() {
            const exDate = new Date(promo.promo_expiry_date);
            const nowDate = new Date();
            const difference = (exDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24);
            const hour = (difference % 1) * 24;
            const min = (hour % 1) * 60;

            return { day: Math.floor(difference), hour: Math.floor(hour), min: Math.floor(min) };
          },
        }));
      setLoading(false);
      setPROMOLIST(PROMOLIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setPROMOLIST([]);
    });
};

export const fetchNotifications = (profilePk, setNotifications) => {
  if (profilePk !== '*') {
    axiosInstance
      .get(`api/agent/notifications/${profilePk}`)
      .then((res) => {
        const NOTICELIST = res.data.map((notice) => ({
          id: notice.id.toString(),
          title: notice.task,
          description: notice.notice,
          avatar: '/static/mock-images/avatars/avatar_default.jpg',
          type: 'friend_interactive',
          createdAt: new Date(notice.notification_time),
          isUnRead: notice.is_unread,
        }));
        setNotifications(NOTICELIST);
      })
      .catch((error) => {
        console.log(error);
        setNotifications([]);
      });
  }
};

export const fetchNewsUpdate = (setNewsUpdates) => {
  axiosInstance
    .get(`api/agent/list-news`)
    .then((res) => {
      const NEWSLIST = res.data.map((news) => ({
        id: news.id,
        title: news.news_title,
        description: news.news_content,
        image: `/static/mock-images/covers/cover_16.jpg`,
        postedAt: new Date(news.update_time),
      }));
      setNewsUpdates(NEWSLIST);
    })
    .catch((error) => {
      console.log(error);
      setNewsUpdates([]);
    });
};

export const fetchNewsDetail = (newsID, setNewDeatil) => {
  axiosInstance
    .get(`api/agent/news-detail/${newsID}`)
    .then((res) => {
      const NEWSDETAIL = {
        id: res.data.id,
        title: res.data.news_title,
        description: res.data.news_content,
        postedAt: new Date(res.data.update_time),
      };
      setNewDeatil(NEWSDETAIL);
    })
    .catch((error) => {
      console.log(error);
      return {};
    });
};
