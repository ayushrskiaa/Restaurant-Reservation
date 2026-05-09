import { data } from "../restApi.json";
import styles from "./Team.module.css";

const Team = () => (
  <section className={styles.section} id="team">
    <div className={styles.inner}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelDash} /> The Kitchen
        </div>
        <h2 className={styles.heading}>Meet Our Chefs</h2>
        <p className={styles.subheading}>
          Passionate craftsmen who turn the finest ingredients into unforgettable dishes.
        </p>
      </div>

      <div className={styles.grid}>
        {data[0].team.map(member => (
          <div key={member.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={member.image} alt={member.name} className={styles.cardImg} loading="lazy" />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardName}>{member.name}</h3>
              <p className={styles.cardRole}>{member.designation}</p>
              <div className={styles.cardAccent} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Team;
