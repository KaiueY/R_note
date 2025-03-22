import React from "react";
import s from "./Card.module.less";
import { Button } from "antd-mobile";

const Card = ({
  title,
  location,
  amount,
  hasUpcomingPayment = true,
  onPayNow = () => {},
}) => {
  return (
    <div className={s.card}>
      <div className={s.card__header}>
        <div className={s.header_content}>
          <span>Electricity Bill</span>
          <span className={s.address}>amsterdam</span>
        </div>
        <div className={s.header_avatar}>
          <img className={s.avatar} src="" alt="" />
        </div>
      </div>
      <div className={s.card__bottom}>
        <div className={s.bottom_head}>
          <span>Upcoming Payments</span>
        </div>
        <div className={s.bottom_body}>
          <div className={s.money}>{`$`}123</div>
          <div className={s.button}>
            <Button size="mini" color="primary">
              Pay Now
            </Button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
