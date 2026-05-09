import { data } from "../restApi.json";
import styles from "./Team.module.css";

const Team = () => {
  return (
    <section className={styles.section} id="team">
      <div className={styles.inner}>

        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>👨‍🍳 The Kitchen</div>
          <h2 className={styles.title}>Meet Our Talented Chefs</h2>
          <p className={styles.subtitle}>
            Passionate craftsmen who turn the finest ingredients into unforgettable dishes — every plate is a work of art.
          </p>
        </div>

        <div className={styles.grid}>
          {data[0].team.map(member => (
            <div key={member.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={member.image}
                  alt={member.name}
                  className={styles.cardImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{member.name}</h3>
                <p className={styles.cardRole}>{member.designation}</p>
                <div className={styles.divider} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;
