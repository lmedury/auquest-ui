import { create } from "ipfs-http-client";
import { IPFS_PROJECT_ID, IPFS_PROJECT_SECRET } from "./constants";
import { Buffer} from 'buffer';

const auth = 'Basic ' + Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_SECRET).toString('base64');
const ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
});

export async function uploadToIpfs(file) {
    const result = await ipfsClient.add(file);
    return result.path;
}

