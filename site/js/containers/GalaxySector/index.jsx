import { withSize } from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import GalaxySectorContainer from './GalaxySectorContainer';

export default withRouter(withSize({ monitorHeight: true, monitorWidth: true })(GalaxySectorContainer));
