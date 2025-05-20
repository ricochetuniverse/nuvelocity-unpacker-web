import {useState} from 'react';

import styles from './ImageResults.module.css';

function Image(props: {base64: string}) {
	return (
		<img
			src={'data:image/png;base64,' + props.base64}
			className={styles.image}
			alt=""
		/>
	);
}

type Props = Readonly<{
	decodedImages: string[];
}>;

export default function ImageResults({decodedImages}: Props) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAll, setShowAll] = useState(false);

	return (
		<div>
			<h2>Decoded images</h2>

			{decodedImages.length > 1 ? (
				<>
					<label>
						<input
							type="checkbox"
							onChange={(ev) => {
								setShowAll(ev.target.checked);
							}}
						/>{' '}
						Show all {decodedImages.length} images
					</label>

					{!showAll ? (
						<>
							<div className={styles.sequenceWrap}>
								<div className={styles.sequenceImage}>
									<Image base64={decodedImages[currentIndex]} />
								</div>

								<div className={styles.sequenceNav}>
									<span>
										<input
											type="number"
											value={currentIndex + 1}
											className={styles.sequenceNumberBox}
											min="0"
											max={decodedImages.length}
											onChange={(ev) => {
												const number = parseInt(ev.target.value, 10);
												if (number >= 1 && number <= decodedImages.length) {
													setCurrentIndex(number - 1);
												}
											}}
										/>{' '}
										of {decodedImages.length}
									</span>

									<button
										type="button"
										title="First"
										disabled={currentIndex === 0}
										onClick={() => {
											setCurrentIndex(0);
										}}
									>
										«
									</button>

									<button
										type="button"
										title="Previous"
										disabled={currentIndex === 0}
										onClick={() => {
											setCurrentIndex(currentIndex - 1);
										}}
									>
										&lsaquo;
									</button>

									<button
										type="button"
										title="Next"
										disabled={currentIndex === decodedImages.length - 1}
										onClick={() => {
											setCurrentIndex(currentIndex + 1);
										}}
									>
										&rsaquo;
									</button>

									<button
										type="button"
										title="Last"
										disabled={currentIndex === decodedImages.length - 1}
										onClick={() => {
											setCurrentIndex(decodedImages.length - 1);
										}}
									>
										»
									</button>
								</div>
							</div>
						</>
					) : (
						<div className={styles.viewAllWrap}>
							{decodedImages.map((img, index) => {
								return <Image base64={img} key={index} />;
							})}
						</div>
					)}
				</>
			) : (
				<Image base64={decodedImages[0]} />
			)}
		</div>
	);
}
