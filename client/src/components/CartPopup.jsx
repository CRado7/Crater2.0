import { useQuery } from '@apollo/client';
import { GET_ALL_SNOWBOARDS } from '../utils/queries'; // Adjust path as needed

const AdminSnowboardCard = () => {
  const { loading, error, data } = useQuery(GET_ALL_SNOWBOARDS);

  if (loading) return <p>Loading Snowboards...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="snowboard-cards-container">
      {data.getAllSnowboards.map((snowboard) => (
        <div key={snowboard.id} className="snowboard-card">
          <img
            src={snowboard.picture}
            alt={snowboard.name}
            className="snowboard-picture"
          />
          <h3>{snowboard.name}</h3>

          <div className="sizes-container">
            <h4>Sizes Offered:</h4>
            <ul>
              {snowboard.sizes.map((size, index) => (
                <li key={index} className="size-item">
                  <span className="size-stock">{snowboard.stock ? snowboard.stock[size] : 'N/A'}</span> {/* Stock value per size */}
                  <span>{size}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSnowboardCard;
