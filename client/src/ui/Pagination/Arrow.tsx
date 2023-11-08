import { memo } from "react";

type ArrowProps = {
	direction: "left" | "right";
	handlePageClick?: () => void;
};

const Arrow: React.FC<ArrowProps> = ({ direction, handlePageClick }) => {
	return direction === "left" ? (
		<div className="prev arrow" onClick={handlePageClick}>
			<svg
				height="800px"
				width="800px"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 34.075 34.075"
			>
				<g>
					<g>
						<path
							style={{ fill: "#010002" }}
							d="M24.57,34.075c-0.505,0-1.011-0.191-1.396-0.577L8.11,18.432c-0.771-0.771-0.771-2.019,0-2.79
              L23.174,0.578c0.771-0.771,2.02-0.771,2.791,0s0.771,2.02,0,2.79l-13.67,13.669l13.67,13.669c0.771,0.771,0.771,2.021,0,2.792
              C25.58,33.883,25.075,34.075,24.57,34.075z"
						/>
					</g>
				</g>
			</svg>
		</div>
	) : (
		<div className="next arrow" onClick={handlePageClick}>
			<svg
				height="800px"
				width="800px"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 185.343 185.343"
			>
				<g>
					<g>
						<path
							style={{ fill: "#010002" }}
							d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
              l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
              c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"
						/>
					</g>
				</g>
			</svg>
		</div>
	);
};

export default memo(Arrow);
