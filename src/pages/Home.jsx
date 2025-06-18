import { HeaderTemp , Footer , Main , Products} from "../Components";
import Info from "../Components/info";
import Scroll from "../Components/scroll";

function Home(){

    return(
        <>
          <HeaderTemp/>
          <Main/>
          <Info/>
          <hr className="container" />
          <Products/>
          <Footer/>
          <Scroll/>
        </>
    )
}
export default Home