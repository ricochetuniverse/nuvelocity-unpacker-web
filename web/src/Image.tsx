import styles from './Image.module.css';

type Props = Readonly<{
	base64: string;
}>;

export default function Image({base64}: Props) {
	return (
		<img
			src={'data:image/png;base64,' + base64}
			className={styles.image}
			alt=""
		/>
	);
}
