import { withSize } from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import UniverseContainer from './UniverseContainer';

export default withRouter(withSize({ monitorHeight: true, monitorWidth: true })(UniverseContainer));
